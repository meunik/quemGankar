<template>
  <div 
    class="bg-gray-900 rounded-xl p-3 border flex flex-col h-full"
    :class="isBestLane ? 'border-green-500 ring-2 ring-green-500 shadow-lg shadow-green-500/30' : 'border-gray-700'"
  >
    <!-- Cabeçalho da Lane -->
    <div class="flex flex-col items-center space-y-2 mb-3 border-b border-gray-700 pb-3">
      <img 
        :src="positionIconUrl" 
        :alt="positionName"
        class="w-10 h-10"
      />
      <div class="text-center">
        <h2 class="text-lg font-bold text-white">{{ positionName }}</h2>
        <div class="text-xs text-gray-400 mt-1">
          {{ champions.length }} campeões
        </div>
      </div>
      
      <!-- Badge de Melhor Lane -->
      <div v-if="isBestLane" class="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse">
        ⭐ MELHOR ROTA PARA GANKAR
      </div>
      
      <!-- Seletor de Campeão -->
      <div class="w-full">
        <ChampionSelector 
          :champions="allChampions"
          :version="version"
          v-model="selectedChampionModel"
        />
      </div>
    </div>
    
    <!-- Campeão Selecionado Destacado -->
    <div v-if="selectedChampion && selectedChampionInList" class="mb-2">
      <div class="text-xs text-gold-400 font-semibold mb-1 text-center">
        🎯 Campeão Selecionado
      </div>
      <ChampionCard 
        :champion="selectedChampion"
        :rank="selectedChampionRank"
        :version="version"
        :rating="selectedChampionRating"
        :is-selected="true"
      />
      <div class="border-b border-gray-600 mt-2"></div>
    </div>
    
    <!-- Lista Vertical de Campeões -->
    <div class="flex flex-col space-y-2 overflow-y-auto flex-1 pr-1">
      <ChampionCard 
        v-for="(champion, index) in displayedChampions" 
        :key="champion.id"
        :champion="champion"
        :rank="getChampionRank(champion, index)"
        :version="version"
        :rating="getRating(getChampionRank(champion, index) - 1)"
        :is-selected="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChampionCard from './ChampionCard.vue'
import ChampionSelector from './ChampionSelector.vue'
import { getPositionIconUrl } from '../services/riotApi.js'

const props = defineProps({
  position: {
    type: String,
    required: true
  },
  champions: {
    type: Array,
    required: true
  },
  allChampions: {
    type: Array,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  selectedChampion: {
    type: Object,
    default: null
  },
  isBestLane: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectedChampion'])

const positionNames = {
  TOP: 'Top Lane',
  MIDDLE: 'Mid Lane', 
  BOTTOM: 'Bot Lane (ADC)',
  UTILITY: 'Suporte'
}

const positionName = computed(() => {
  return positionNames[props.position] || props.position
})

const positionIconUrl = computed(() => {
  return getPositionIconUrl(props.position)
})

const selectedChampionModel = computed({
  get: () => props.selectedChampion,
  set: (value) => emit('update:selectedChampion', value)
})

// Verifica se o campeão selecionado está na lista
const selectedChampionInList = computed(() => {
  if (!props.selectedChampion) return null
  return props.champions.find(c => c.id === props.selectedChampion.id)
})

// Obtém o rank do campeão selecionado
const selectedChampionRank = computed(() => {
  if (!selectedChampionInList.value) return props.champions.length + 1
  return props.champions.findIndex(c => c.id === props.selectedChampion.id) + 1
})

// Obtém o rating do campeão selecionado
const selectedChampionRating = computed(() => {
  return getRating(selectedChampionRank.value - 1)
})

// Campeões exibidos (sem o selecionado se ele estiver na lista)
const displayedChampions = computed(() => {
  if (!props.selectedChampion) return props.champions
  
  return props.champions.filter(c => c.id !== props.selectedChampion.id)
})

// Função para obter o rank correto considerando o campeão removido
const getChampionRank = (champion, displayIndex) => {
  const originalIndex = props.champions.findIndex(c => c.id === champion.id)
  return originalIndex + 1
}

// Função para simular rating baseado na posição no ranking
const getRating = (index) => {
  if (index < 3) return 5      // Top 3 = 5 estrelas
  if (index < 6) return 4      // Top 6 = 4 estrelas  
  if (index < 10) return 3     // Top 10 = 3 estrelas
  return 2                     // Resto = 2 estrelas
}
</script>

<style scoped>
/* Customizar scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.4);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.6);
}
</style>