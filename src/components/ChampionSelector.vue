<template>
  <div class="relative" ref="selectorRef">
    <!-- Botão de Seleção -->
    <button 
      @click="toggleDropdown"
      class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex items-center justify-between"
      :class="{ 'ring-2 ring-gold-400': selectedChampion }"
    >
      <span v-if="selectedChampion" class="flex items-center space-x-2">
        <img 
          :src="getChampionImageUrl(version, selectedChampion.id)" 
          :alt="selectedChampion.name"
          class="w-6 h-6 rounded-full border border-gold-400"
        />
        <span class="truncate">{{ selectedChampion.name }}</span>
      </span>
      <span v-else class="text-gray-400">Selecionar campeão...</span>
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-80 overflow-hidden flex flex-col"
    >
      <!-- Campo de Busca -->
      <div class="p-2 border-b border-gray-700 sticky top-0 bg-gray-800">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Buscar campeão..."
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          @click.stop
        />
      </div>

      <!-- Lista de Campeões -->
      <div class="overflow-y-auto max-h-64">
        <!-- Opção para desselecionar -->
        <button 
          v-if="selectedChampion"
          @click="handleSelect(null)"
          class="w-full px-3 py-2 text-left hover:bg-gray-700 text-red-400 text-sm font-medium border-b border-gray-700"
        >
          ✕ Remover seleção
        </button>

        <!-- Campeões filtrados -->
        <button
          v-for="champion in filteredChampions"
          :key="champion.id"
          @click="handleSelect(champion)"
          class="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center space-x-2 text-sm"
          :class="{ 'bg-gray-700': selectedChampion?.id === champion.id }"
        >
          <img 
            :src="getChampionImageUrl(version, champion.id)" 
            :alt="champion.name"
            class="w-8 h-8 rounded-full border border-gray-600"
            @error="handleImageError"
          />
          <div class="flex-1">
            <div class="text-white font-medium">{{ champion.name }}</div>
            <div class="text-gray-400 text-xs">{{ champion.title }}</div>
          </div>
          <span v-if="selectedChampion?.id === champion.id" class="text-gold-400">✓</span>
        </button>

        <!-- Mensagem quando não há resultados -->
        <div v-if="filteredChampions.length === 0" class="px-3 py-4 text-center text-gray-400 text-sm">
          Nenhum campeão encontrado
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getChampionImageUrl } from '../services/riotApi.js'

const props = defineProps({
  champions: {
    type: Array,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectorRef = ref(null)

const selectedChampion = computed(() => props.modelValue)

const filteredChampions = computed(() => {
  if (!searchQuery.value) {
    return props.champions
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.champions.filter(champion => 
    champion.name.toLowerCase().includes(query) ||
    champion.title.toLowerCase().includes(query)
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const handleSelect = (champion) => {
  emit('update:modelValue', champion)
  isOpen.value = false
  searchQuery.value = ''
}

const handleImageError = (event) => {
  event.target.src = 'https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/Ahri.png'
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>