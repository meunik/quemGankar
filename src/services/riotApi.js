import axios from 'axios'

const api = axios.create({
  timeout: 10000
})

// Serviço para obter a versão atual do jogo
export const getGameVersion = async () => {
  try {
    const response = await api.get('https://ddragon.leagueoflegends.com/realms/br.json')
    return response.data.v
  } catch (error) {
    console.error('Erro ao obter versão do jogo:', error)
    return '15.20.1' // versão fallback
  }
}

// Serviço para obter todos os campeões
export const getChampions = async (version) => {
  try {
    const response = await api.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao obter campeões:', error)
    return {}
  }
}

// Serviço para obter dados específicos de um campeão
export const getChampionDetails = async (version, championKey) => {
  try {
    const response = await api.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion/${championKey}.json`)
    return response.data.data[championKey]
  } catch (error) {
    console.error(`Erro ao obter detalhes do campeão ${championKey}:`, error)
    return null
  }
}

// Serviço para obter dados de posição dos campeões
export const getChampionPositions = async () => {
  try {
    const response = await api.get('https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-statistics/global/default/rcp-fe-lol-champion-statistics.js')
    
    // O arquivo JavaScript contém um objeto com dados por posição
    // Formato: { BOTTOM: { "championId": pickRate, ... }, SUPPORT: { ... }, ... }
    const jsCode = response.data
    
    // Procurar pelo JSON.parse no código
    const jsonParseRegex = /JSON\.parse\(['"](.+?)['"]\)/g
    let match
    let positionData = null
    
    while ((match = jsonParseRegex.exec(jsCode)) !== null) {
      try {
        // Tentar fazer parse do conteúdo encontrado
        const jsonString = match[1].replace(/\\"/g, '"')
        const parsed = JSON.parse(jsonString)
        
        // Verificar se tem as chaves de posição que esperamos
        if (parsed.BOTTOM || parsed.SUPPORT || parsed.JUNGLE || parsed.MIDDLE || parsed.TOP) {
          positionData = parsed
          break
        }
      } catch (e) {
        // Continuar procurando se der erro
        continue
      }
    }
    
    if (!positionData) {
      console.warn('Não foi possível extrair dados de posição, usando fallback')
      return {}
    }
    
    // Converter o formato de { POSITION: { championId: pickRate } } 
    // para { championKey: [POSITION1, POSITION2] }
    return positionData
    
  } catch (error) {
    console.error('Erro ao obter posições dos campeões:', error)
    return {}
  }
}

// Função auxiliar para mapear IDs de campeões para suas posições
export const mapChampionPositions = (positionData, champions) => {
  const championPositionMap = {}
  
  // Para cada posição (TOP, MIDDLE, JUNGLE, BOTTOM, SUPPORT)
  Object.entries(positionData).forEach(([position, championsInPosition]) => {
    // Para cada ID de campeão nesta posição
    Object.keys(championsInPosition).forEach(championId => {
      // Encontrar o campeão pelo ID (key)
      const champion = Object.values(champions).find(c => c.key === championId)
      
      if (champion) {
        if (!championPositionMap[champion.name]) {
          championPositionMap[champion.name] = []
        }
        
        // Mapear nomes de posição
        const positionName = position === 'SUPPORT' ? 'UTILITY' : position
        
        if (!championPositionMap[champion.name].includes(positionName)) {
          championPositionMap[champion.name].push(positionName)
        }
      }
    })
  })
  
  return championPositionMap
}

// Função para calcular Strong/Weak Side baseado em características do campeão
// Strong Side = Campeões early game que precisam de ganks para snowball
// Weak Side = Campeões que escalam bem e podem ficar sozinhos
export const calculateChampionSides = async (positionData, champions, version) => {
  const championSideMap = {}
  
  // Para cada posição
  for (const [position, championsInPosition] of Object.entries(positionData)) {
    const positionName = position === 'SUPPORT' ? 'UTILITY' : position
    
    // Para cada campeão nesta posição
    for (const [championId, pickRate] of Object.entries(championsInPosition)) {
      const champion = Object.values(champions).find(c => c.key === championId)
      
      if (champion) {
        if (!championSideMap[champion.name]) {
          championSideMap[champion.name] = {}
        }
        
        // Buscar detalhes do campeão para analisar suas características
        const details = await getChampionDetails(version, champion.id)
        
        if (details) {
          // ===== CALCULAR POTENCIAL DE GANK =====
          // Baseado em: CC potencial, burst damage, mobilidade
          let gankPotential = 0
          
          // 1. Tags que indicam CC/Setup
          if (details.tags.includes('Fighter')) gankPotential += 1.5  // Tem engage
          if (details.tags.includes('Tank')) gankPotential += 2       // CC pesado
          if (details.tags.includes('Assassin')) gankPotential += 1   // Burst damage
          if (details.tags.includes('Mage')) gankPotential += 0.5     // Pode ter CC
          
          // 2. Campeões com pouca mobilidade são mais fáceis de gankar
          // (baixo attack + baixa defense = imóvel e vulnerável)
          if (details.info.defense <= 3) gankPotential += 1.5
          
          // 3. ADCs são sempre alto prioridade para gank
          if (details.tags.includes('Marksman')) gankPotential += 2
          
          // 4. Suportes com CC são excelentes para receber gank
          if (details.tags.includes('Support')) gankPotential += 1.5
          
          // Normalizar para escala 1-5
          const normalizedGankPotential = Math.min(5, Math.max(1, Math.round(gankPotential)))
          
          // ===== CALCULAR STRONG/WEAK SIDE =====
          let strongSideScore = 0
          
          // 1. Tags que indicam early game (Assassin, Fighter ganham pontos)
          if (details.tags.includes('Assassin')) strongSideScore += 2
          if (details.tags.includes('Fighter')) strongSideScore += 1.5
          
          // 2. Campeões com alto attack mas baixa defense precisam de vantagem inicial
          const attackDefenseRatio = details.info.attack / details.info.defense
          if (attackDefenseRatio > 1.5) strongSideScore += 1.5
          
          // 3. Baixa defesa indica fragilidade, precisa snowball
          if (details.info.defense <= 4) strongSideScore += 1
          
          // 4. Tags de scaling (Mage de longo alcance tende a scale)
          if (details.tags.includes('Mage') && !details.tags.includes('Assassin')) strongSideScore -= 1
          if (details.tags.includes('Tank')) strongSideScore -= 1.5
          if (details.tags.includes('Support')) strongSideScore -= 1
          
          // 5. Alto magic damage pode indicar scaling
          if (details.info.magic >= 7) strongSideScore -= 0.5
          
          // Determinar se é Strong ou Weak Side
          // Score > 2 = Strong Side (precisa de ganks)
          // Score <= 2 = Weak Side (pode ficar sozinho)
          const isStrongSide = strongSideScore > 2
          
          championSideMap[champion.name][positionName] = {
            side: isStrongSide ? 'STRONG' : 'WEAK',
            gankPotential: normalizedGankPotential,
            pickRate: pickRate,
            strongSideScore: strongSideScore,
            tags: details.tags,
            info: details.info
          }
        }
      }
    }
  }
  
  return championSideMap
}

// Função para obter dados de pick rate de um campeão em uma posição específica
export const getChampionPickRate = (positionData, championKey, position) => {
  const positionName = position === 'UTILITY' ? 'SUPPORT' : position
  const championsInPosition = positionData[positionName]
  
  if (!championsInPosition) return null
  
  return championsInPosition[championKey] || null
}

// Função para gerar URL da imagem do campeão
export const getChampionImageUrl = (version, championKey) => {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championKey}.png`
}

// URLs dos ícones das posições
export const getPositionIconUrl = (position) => {
  const icons = {
    TOP: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
    MIDDLE: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
    BOTTOM: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
    UTILITY: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
  }
  return icons[position] || icons.MIDDLE
}