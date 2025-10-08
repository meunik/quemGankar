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