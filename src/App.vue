<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <!-- Header -->
    <header class="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-2">
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
    </header>

    <!-- Filtros -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-gray-700">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <label class="text-white font-medium text-sm">Filtrar por nível de gank:</label>
          <div class="flex space-x-2">
            <button 
              v-for="level in [2, 3, 6]" 
              :key="level"
              @click="selectedLevel = level"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 text-sm',
                selectedLevel === level 
                  ? 'bg-gold-500 text-black' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              ]"
            >
              Nível {{ level }}
            </button>
          </div>
          <button 
            @click="selectedLevel = null"
            :class="[
              'px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 text-sm',
              selectedLevel === null 
                ? 'bg-gold-500 text-black' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            ]"
          >
            Todos os Níveis
          </button>
        </div>
      </div>

      <!-- Legenda do Sistema de Rating -->
      <div class="bg-blue-900/20 backdrop-blur-sm rounded-xl p-3 mb-4 border border-blue-700/50">
        <div class="flex items-start space-x-2">
          <div class="text-blue-400 text-lg mt-0.5">ℹ️</div>
          <div class="flex-1">
            <h3 class="text-white font-semibold text-sm mb-1">Como funciona o sistema de avaliação:</h3>
            <p class="text-gray-300 text-xs leading-relaxed">
              O <strong class="text-gold-400">Potencial de Gank</strong> indica o quão favorável é gankar aquela lane quando o campeão está jogando. 
              A classificação varia de 1 a 5 estrelas, onde:
            </p>
            <div class="mt-1.5 space-y-0.5 text-xs text-gray-300">
              <div class="flex items-center space-x-2">
                <span class="text-gold-400">★★★★★</span>
                <span>Excelente - Top 3 campeões (melhor follow-up, CC ou burst)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gold-400">★★★★☆</span>
                <span>Muito Bom - Top 4-6 (ótimo potencial de setup)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gold-400">★★★☆☆</span>
                <span>Bom - Top 7-10 (bom follow-up)</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">★★☆☆☆</span>
                <span>Moderado - Demais campeões (potencial limitado ou situacional)</span>
              </div>
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
          :version="gameVersion"
          :selected-champion="selectedChampions[position]"
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
  getPositionIconUrl,
  getChampionImageUrl
} from './services/riotApi.js'

// Estado reativo
const loading = ref(true)
const error = ref(null)
const gameVersion = ref('15.20.1')
const champions = ref({})
const championPositions = ref({})
const selectedLevel = ref(null)

// Campeões selecionados por posição
const selectedChampions = ref({
  TOP: null,
  MIDDLE: null,
  BOTTOM: null,
  UTILITY: null
})

// Ordem de exibição das posições
const positionOrder = ['MIDDLE', 'TOP', 'BOTTOM', 'UTILITY']

// Nomes das posições em português
const positionNames = {
  TOP: 'Top Lane',
  MIDDLE: 'Mid Lane', 
  BOTTOM: 'Bot Lane',
  UTILITY: 'Suporte'
}

// Dados de ranking baseado em potencial de gank por nível
const gankPotentialByLevel = {
  2: {
    // Nível 2 - Primeiros ganks, champions com CC ou burst early
    MIDDLE: [
      'LeBlanc', 'Syndra', 'TwistedFate', 'Katarina', 'Zed', 
      'Yasuo', 'Ahri', 'Kassadin', 'Azir', 'Orianna'
    ],
    TOP: [
      'Camille', 'Irelia', 'Renekton', 'Darius', 'Jax',
      'Fiora', 'Shen', 'Garen', 'Malphite', 'Ornn'
    ],
    BOTTOM: [
      'Caitlyn', 'Jhin', 'Ashe', 'MissFortune', 'Jinx',
      'Ezreal', 'Lucian', 'Vayne', 'KaiSa', 'Xayah'
    ],
    UTILITY: [
      'Thresh', 'Nautilus', 'Leona', 'Blitzcrank', 'Alistar',
      'Morgana', 'Braum', 'Lulu', 'Janna', 'Soraka'
    ]
  },
  3: {
    // Nível 3 - Mais opções de combo, skills de mobilidade
    MIDDLE: [
      'TwistedFate', 'LeBlanc', 'Zed', 'Katarina', 'Yasuo',
      'Ahri', 'Kassadin', 'Syndra', 'Azir', 'Orianna'
    ],
    TOP: [
      'Shen', 'Camille', 'Irelia', 'Jax', 'Fiora',
      'Renekton', 'Darius', 'Garen', 'Malphite', 'Ornn'
    ],
    BOTTOM: [
      'Caitlyn', 'Ezreal', 'Lucian', 'Jhin', 'Jinx',
      'Ashe', 'MissFortune', 'Vayne', 'KaiSa', 'Xayah'
    ],
    UTILITY: [
      'Thresh', 'Blitzcrank', 'Nautilus', 'Morgana', 'Leona',
      'Alistar', 'Braum', 'Lulu', 'Janna', 'Soraka'
    ]
  },
  6: {
    // Nível 6 - Ultimate disponível, alto potencial de pick
    MIDDLE: [
      'TwistedFate', 'Kassadin', 'LeBlanc', 'Zed', 'Yasuo',
      'Katarina', 'Ahri', 'Azir', 'Syndra', 'Orianna'
    ],
    TOP: [
      'Shen', 'Camille', 'Malphite', 'Irelia', 'Jax',
      'Fiora', 'Renekton', 'Darius', 'Garen', 'Ornn'
    ],
    BOTTOM: [
      'Jhin', 'Ashe', 'MissFortune', 'Caitlyn', 'Jinx',
      'Ezreal', 'Vayne', 'KaiSa', 'Lucian', 'Xayah'
    ],
    UTILITY: [
      'Thresh', 'Nautilus', 'Leona', 'Morgana', 'Blitzcrank',
      'Alistar', 'Braum', 'Lulu', 'Janna', 'Soraka'
    ]
  }
}

// Ranking geral (todos os níveis combinados)
const gankPotential = {
  MIDDLE: [
    'TwistedFate', 'LeBlanc', 'Kassadin', 'Zed', 'Katarina', 
    'Yasuo', 'Ahri', 'Syndra', 'Azir', 'Orianna'
  ],
  TOP: [
    'Shen', 'Camille', 'Irelia', 'Jax', 'Fiora',
    'Renekton', 'Darius', 'Malphite', 'Garen', 'Ornn'
  ],
  BOTTOM: [
    'Caitlyn', 'Jhin', 'Ashe', 'Ezreal', 'MissFortune',
    'Jinx', 'Lucian', 'Vayne', 'KaiSa', 'Xayah'
  ],
  UTILITY: [
    'Thresh', 'Nautilus', 'Leona', 'Blitzcrank', 'Morgana',
    'Alistar', 'Braum', 'Lulu', 'Janna', 'Soraka'
  ]
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
    
    // Mapeia os IDs de campeões para suas posições
    const mappedPositions = mapChampionPositions(positionsData, championsData)
    championPositions.value = mappedPositions
    
    console.log('Posições carregadas:', Object.keys(mappedPositions).length, 'campeões')
    
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
  // Seleciona o ranking baseado no nível selecionado
  const currentGankData = selectedLevel.value ? 
    gankPotentialByLevel[selectedLevel.value] : 
    gankPotential
    
  const potentialOrder = currentGankData[position] || []
  const positionChampions = []
  
  // Primeiro, adiciona campeões na ordem de potencial definida
  potentialOrder.forEach(championKey => {
    const champion = champions.value[championKey]
    if (champion) {
      positionChampions.push(champion)
    }
  })
  
  // Depois adiciona outros campeões da posição que não estão na lista de potencial
  Object.values(champions.value).forEach(champion => {
    const championPositionsList = championPositions.value[champion.name] || []
    
    if (championPositionsList.includes(position) && 
        !positionChampions.find(c => c.id === champion.id)) {
      positionChampions.push(champion)
    }
  })
  
  return positionChampions // Retorna TODOS os campeões da posição
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