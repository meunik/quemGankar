<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <!-- Título e Descrição (fora do header) -->
    <div class="bg-gray-900/50 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gold-400 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-2">
          Quem Gankar
        </h1>
        <p class="text-gray-300 text-lg">
          Ranking dos Melhores Campeões para Jungle Gankar
        </p>
        <p class="text-gray-400 text-sm mt-1">
          League of Legends - 
          <span v-if="selectedLevel" class="text-gold-400 font-medium">
            Especializado em ganks de nível {{ selectedLevel }}
          </span>
          <span v-else>
            Baseado em potencial geral de gank (níveis 2, 3 e 6)
          </span>
        </p>
      </div>
    </div>

    <!-- Header Compacto com Logo e Filtros -->
    <header class="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo e Nome -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white hidden md:block">Quem Gankar</h2>
          </div>

          <!-- Filtros de Nível -->
          <div class="flex items-center space-x-2">
            <span class="text-gray-300 text-sm font-medium hidden sm:inline">Nível:</span>
            <button 
              @click="selectedLevel = 1"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 text-sm',
                selectedLevel === 1 
                  ? 'bg-gold-500 text-black shadow-md' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              ]"
            >
              1
            </button>
            <button 
              v-for="level in [2, 3]" 
              :key="level"
              @click="selectedLevel = level"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 text-sm',
                selectedLevel === level 
                  ? 'bg-gold-500 text-black shadow-md' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              ]"
            >
              {{ level }}
            </button>
            <button 
              @click="selectedLevel = 6"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 text-sm',
                selectedLevel === 6 
                  ? 'bg-gold-500 text-black shadow-md' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              ]"
            >
              6+
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Legenda do Sistema de Rating -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="bg-blue-900/20 backdrop-blur-sm rounded-xl p-3 mb-4 border border-blue-700/50">
        <div class="flex items-start space-x-2">
          <div class="text-blue-400 text-lg mt-0.5">ℹ️</div>
          <div class="flex-1">
            <h3 class="text-white font-semibold text-sm mb-2">Sistema de Classificação com 4 Métricas:</h3>
            
            <!-- Prioridade 1: Facilidade de Gankar -->
            <div class="mb-2">
              <p class="text-gray-300 text-xs font-medium mb-1">
                <strong class="text-emerald-400">1️⃣ Facilidade de Gankar</strong> (1-5 ⭐) - 🔥 PESO MÁXIMO
              </p>
              <p class="text-gray-400 text-xs leading-relaxed ml-4">
                Quão <strong>fácil é gankar COM esse campeão ALIADO</strong>. Alto = Campeão tem CC/setup (Pantheon stun, Jax E, Leona). Baixo = Sem CC/difícil (Heimerdinger, Fiora). 
                <strong>Varia por nível:</strong> Lvl 1 (só Q disponível), Lvl 2 (Q+W), Lvl 3 (Q+W+E), Lvl 6+ (com ult). Tanks/Suportes fortes em todos os níveis (CC), Marksman fracos até lvl 6+ (alguns ganham ult de CC como Ashe R).
              </p>
            </div>
            
            <!-- Prioridade 2: Potencial de Gank -->
            <div class="mb-2">
              <p class="text-gray-300 text-xs font-medium mb-1">
                <strong class="text-gold-400">2️⃣ Potencial de Gank</strong> (1-5 ⭐) - 🔥 PESO MÁXIMO
              </p>
              <p class="text-gray-400 text-xs leading-relaxed ml-4">
                Baseado em CC, burst damage e vulnerabilidade do campeão. Tanks e Marksmen = alto potencial.
              </p>
            </div>
            
            <!-- Prioridade 3: Strong/Weak Side -->
            <div class="mb-2">
              <p class="text-gray-300 text-xs font-medium mb-1">
                <strong class="text-red-400">3️⃣ Strong Side</strong> 🔥 vs <strong class="text-blue-400">Weak Side</strong> ⚖️ - Peso Menor
              </p>
              <div class="text-gray-400 text-xs leading-relaxed ml-4 space-y-0.5">
                <div><span class="text-red-400 font-bold">🔥 Strong:</span> Precisam de ganks early (Samira, Draven)</div>
                <div><span class="text-blue-400 font-bold">⚖️ Weak:</span> Escalam sozinhos (K'Sante, Orianna)</div>
              </div>
            </div>
            
            <!-- Prioridade 4: Pick Rate -->
            <div>
              <p class="text-gray-300 text-xs font-medium mb-1">
                <strong class="text-purple-400">4️⃣ Pick Rate</strong> (%) - Desempate Final
              </p>
              <p class="text-gray-400 text-xs leading-relaxed ml-4">
                Taxa de escolha do campeão na posição. Usado apenas como critério de desempate.
              </p>
            </div>
            
            <div class="mt-2 pt-2 border-t border-blue-700/30">
              <p class="text-gray-400 text-xs italic">
                ✨ Todas as métricas são calculadas dinamicamente a partir das APIs da Riot Games
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
        <p class="text-white mt-4">Carregando dados dos campeões...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12">
      <div class="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">
        <p class="text-red-400 text-lg mb-2">Erro ao carregar dados</p>
        <p class="text-gray-300 text-sm">{{ error }}</p>
        <button 
          @click="loadData" 
          class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Tentar Novamente
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Resumo de Seleções -->
      <div v-if="Object.values(selectedChampions).some(c => c !== null)" 
           class="mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/50">
        <h3 class="text-white font-bold text-sm mb-3 text-center">🎮 Time Inimigo Selecionado</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="position in positionOrder" :key="position" class="text-center">
            <div class="text-xs text-gray-400 mb-1">{{ getPositionName(position) }}</div>
            <div v-if="selectedChampions[position]" class="flex flex-col items-center">
              <img 
                :src="getChampionImageUrl(gameVersion, selectedChampions[position].id)" 
                :alt="selectedChampions[position].name"
                class="w-12 h-12 rounded-full border-2 mb-1"
                :class="getBestLaneToGank === position ? 'border-green-400 ring-2 ring-green-400' : 'border-gold-400'"
              />
              <span class="text-white text-xs font-medium">{{ selectedChampions[position].name }}</span>
              <span v-if="getBestLaneToGank === position" class="text-green-400 text-xs font-bold mt-1">
                ⭐ GANKAR AQUI
              </span>
            </div>
            <div v-else class="text-gray-500 text-xs py-4">
              Não selecionado
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="(count, position) in championCounts" :key="position" 
             class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700 text-center">
          <img :src="getPositionIconUrl(position)" :alt="position" class="w-6 h-6 mx-auto mb-2" />
          <div class="text-2xl font-bold text-gold-400">{{ count }}</div>
          <div class="text-sm text-gray-300">{{ getPositionName(position) }}</div>
        </div>
      </div>

      <!-- Lane Rankings - Grid Lado a Lado -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <LaneRanking 
          v-for="position in positionOrder" 
          :key="position"
          :position="position"
          :champions="getChampionsByPosition(position)"
          :all-champions="allChampionsArray"
          :champion-sides="championSides"
          :version="gameVersion"
          :selected-champion="selectedChampions[position]"
          :selected-level="selectedLevel"
          :is-best-lane="getBestLaneToGank === position"
          @update:selected-champion="(champion) => updateSelectedChampion(position, champion)"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700 py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 text-sm">
          Dados fornecidos pela Riot Games API | Versão do jogo: {{ gameVersion }}
        </p>
        <p class="text-gray-500 text-xs mt-2">
          Este produto não é endossado, certificado ou de outra forma aprovado pela Riot Games, Inc. ou por qualquer de suas afiliadas.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import LaneRanking from './components/LaneRanking.vue'
import { 
  getGameVersion, 
  getChampions, 
  getChampionPositions,
  mapChampionPositions,
  calculateChampionSides,
  getPositionIconUrl,
  getChampionImageUrl
} from './services/riotApi.js'

// Estado reativo
const loading = ref(true)
const error = ref(null)
const gameVersion = ref('15.20.1')
const champions = ref({})
const championPositions = ref({})
const championSides = ref({}) // Strong/Weak side por campeão e posição
const positionDataRaw = ref({}) // Dados brutos de pick rate
const selectedLevel = ref(null)

// Campeões selecionados por posição
const selectedChampions = ref({
  TOP: null,
  MIDDLE: null,
  BOTTOM: null,
  UTILITY: null
})

// Ordem de exibição das posições
const positionOrder = ['TOP', 'MIDDLE', 'BOTTOM', 'UTILITY']

// Nomes das posições em português
const positionNames = {
  TOP: 'Top Lane',
  MIDDLE: 'Mid Lane', 
  BOTTOM: 'Bot Lane',
  UTILITY: 'Suporte'
}

// Função para carregar todos os dados
const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Carrega versão do jogo
    gameVersion.value = await getGameVersion()
    
    // Carrega campeões
    const championsData = await getChampions(gameVersion.value)
    champions.value = championsData
    
    // Carrega posições (retorna o JSON bruto da Community Dragon)
    const positionsData = await getChampionPositions()
    positionDataRaw.value = positionsData
    
    // Mapeia os IDs de campeões para suas posições
    const mappedPositions = mapChampionPositions(positionsData, championsData)
    championPositions.value = mappedPositions
    
    // Calcula Strong/Weak Side para cada campeão em cada posição
    const calculatedSides = await calculateChampionSides(positionsData, championsData, gameVersion.value)
    championSides.value = calculatedSides
    
    console.log('Posições carregadas:', Object.keys(mappedPositions).length, 'campeões')
    console.log('Strong/Weak sides calculados:', Object.keys(calculatedSides).length, 'campeões')
    
  } catch (err) {
    error.value = err.message || 'Erro desconhecido ao carregar dados'
    console.error('Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}

// Computed para contar campeões por posição
const championCounts = computed(() => {
  const counts = {}
  positionOrder.forEach(position => {
    counts[position] = getChampionsByPosition(position).length
  })
  return counts
})

// Função para obter campeões por posição ordenados por potencial de gank
const getChampionsByPosition = (position) => {
  const positionChampions = []
  
  // Obter todos os campeões que jogam nesta posição
  Object.values(champions.value).forEach(champion => {
    const championPositionsList = championPositions.value[champion.name] || []
    
    if (championPositionsList.includes(position)) {
      positionChampions.push(champion)
    }
  })
  
  // Ordenar baseado em prioridade com pesos:
  // PESO ALTO: 1) Facilidade de Gankar (por nível), 2) Potencial de Gank
  // PESO BAIXO: 3) Strong Side, 4) Pick Rate
  positionChampions.sort((a, b) => {
    const aSideData = championSides.value[a.name]?.[position]
    const bSideData = championSides.value[b.name]?.[position]
    
    // Se não tiver dados, coloca no final
    if (!aSideData && !bSideData) return 0
    if (!aSideData) return 1
    if (!bSideData) return -1
    
    // Prioridade 1: Facilidade de Gankar (baseado no nível selecionado)
    let aGankEase = 3
    let bGankEase = 3
    
    if (selectedLevel.value === 2) {
      aGankEase = aSideData.gankEase?.level2 || 3
      bGankEase = bSideData.gankEase?.level2 || 3
    } else if (selectedLevel.value === 3) {
      aGankEase = aSideData.gankEase?.level3 || 3
      bGankEase = bSideData.gankEase?.level3 || 3
    } else if (selectedLevel.value === 6) {
      aGankEase = aSideData.gankEase?.level6 || 3
      bGankEase = bSideData.gankEase?.level6 || 3
    } else {
      // Se "Todos", usa média dos 3 níveis
      const aAvg = ((aSideData.gankEase?.level2 || 3) + (aSideData.gankEase?.level3 || 3) + (aSideData.gankEase?.level6 || 3)) / 3
      const bAvg = ((bSideData.gankEase?.level2 || 3) + (bSideData.gankEase?.level3 || 3) + (bSideData.gankEase?.level6 || 3)) / 3
      aGankEase = aAvg
      bGankEase = bAvg
    }
    
    const gankEaseDiff = bGankEase - aGankEase
    if (Math.abs(gankEaseDiff) >= 0.5) return gankEaseDiff
    
    // Prioridade 2: Potencial de Gank (maior é melhor)
    const gankPotentialDiff = (bSideData.gankPotential || 0) - (aSideData.gankPotential || 0)
    if (gankPotentialDiff !== 0) return gankPotentialDiff
    
    // Prioridade 3: Strong Side vem primeiro (peso menor)
    if (aSideData.side === 'STRONG' && bSideData.side === 'WEAK') return -1
    if (aSideData.side === 'WEAK' && bSideData.side === 'STRONG') return 1
    
    // Prioridade 4: Pick Rate (peso menor, desempate final)
    return bSideData.pickRate - aSideData.pickRate
  })
  
  return positionChampions
}

// Função para obter nome da posição
const getPositionName = (position) => {
  return positionNames[position] || position
}

// Computed para obter lista de todos os campeões (array)
const allChampionsArray = computed(() => {
  return Object.values(champions.value).sort((a, b) => a.name.localeCompare(b.name))
})

// Função para calcular a melhor lane para gankar
const getBestLaneToGank = computed(() => {
  const selectedCount = Object.values(selectedChampions.value).filter(c => c !== null).length
  
  // Precisa de pelo menos 2 campeões selecionados para calcular
  if (selectedCount < 2) return null
  
  const laneScores = {}
  
  positionOrder.forEach(position => {
    const champion = selectedChampions.value[position]
    if (!champion) {
      laneScores[position] = 0
      return
    }
    
    // Obtém o rank do campeão na posição
    const positionChampions = getChampionsByPosition(position)
    const championIndex = positionChampions.findIndex(c => c.id === champion.id)
    const rank = championIndex !== -1 ? championIndex + 1 : positionChampions.length + 1
    
    // Calcula score baseado no rank (menor rank = maior score)
    // Top 3 = 10 pontos, Top 6 = 8 pontos, Top 10 = 6 pontos, demais = 4 pontos
    let score = 4
    if (rank <= 3) score = 10
    else if (rank <= 6) score = 8
    else if (rank <= 10) score = 6
    
    laneScores[position] = score
  })
  
  // Encontra a lane com maior score
  let bestLane = null
  let maxScore = 0
  
  Object.entries(laneScores).forEach(([position, score]) => {
    if (score > maxScore && selectedChampions.value[position] !== null) {
      maxScore = score
      bestLane = position
    }
  })
  
  return bestLane
})

// Função para atualizar campeão selecionado de uma posição
const updateSelectedChampion = (position, champion) => {
  selectedChampions.value[position] = champion
}

// Carrega dados quando o componente é montado
onMounted(() => {
  loadData()
})
</script>

<style>
/* Cores personalizadas para o tema dourado */
:root {
  --gold-400: #fbbf24;
  --gold-500: #f59e0b;
  --gold-600: #d97706;
}

.text-gold-400 { color: var(--gold-400); }
.text-gold-500 { color: var(--gold-500); }
.text-gold-600 { color: var(--gold-600); }
.bg-gold-400 { background-color: var(--gold-400); }
.bg-gold-500 { background-color: var(--gold-500); }
.bg-gold-600 { background-color: var(--gold-600); }
.border-gold-400 { border-color: var(--gold-400); }
.from-gold-400 { --tw-gradient-from: var(--gold-400); }
.to-gold-600 { --tw-gradient-to: var(--gold-600); }
</style>