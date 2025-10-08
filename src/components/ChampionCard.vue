<template>
  <div 
    class="bg-gray-800 rounded-lg p-3 transition-all duration-200 border"
    :class="[
      isSelected ? 'border-gold-400 bg-gradient-to-br from-gold-900/30 to-gray-800 shadow-lg shadow-gold-500/20' : 'border-gray-600 hover:bg-gray-700',
      isSelected ? 'ring-2 ring-gold-400' : ''
    ]"
  >
    <div class="flex flex-col items-center space-y-2">
      <!-- Imagem do Campeão -->
      <div class="relative">
        <img 
          :src="championImageUrl" 
          :alt="champion.name"
          class="w-14 h-14 rounded-full border-2 shadow-lg"
          :class="isSelected ? 'border-gold-400' : 'border-gray-500'"
          @error="handleImageError"
        />
        <!-- Ranking position -->
        <div 
          class="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-black"
          :class="isSelected ? 'bg-gold-400' : 'bg-gray-400'"
        >
          {{ rank }}
        </div>
        <!-- Badge de selecionado -->
        <div v-if="isSelected" class="absolute -bottom-1 -left-1 bg-gold-400 rounded-full p-1">
          <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- Nome do Campeão -->
      <div class="text-center">
        <h3 class="text-xs font-semibold" :class="isSelected ? 'text-gold-400' : 'text-white'">
          {{ champion.name }}
        </h3>
        <p class="text-xs text-gray-400 line-clamp-1">{{ champion.title }}</p>
        
        <!-- Badge Strong/Weak Side -->
        <div v-if="championSide" class="mt-1 flex flex-col items-center space-y-1">
          <span 
            v-if="championSide.side === 'STRONG'"
            class="inline-block px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full"
            title="Strong Side - Precisa de ganks early para snowball!"
          >
            � STRONG SIDE
          </span>
          <span 
            v-else
            class="inline-block px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full"
            title="Weak Side - Escala bem, pode ficar sozinho"
          >
            ⚖️ WEAK SIDE
          </span>
          
          <!-- Pick Rate separado -->
          <span 
            class="inline-block px-2 py-0.5 bg-purple-600/80 text-white text-xs font-medium rounded-full"
            :title="`Taxa de escolha: ${(championSide.pickRate * 100).toFixed(1)}%`"
          >
            � {{ (championSide.pickRate * 100).toFixed(1) }}% pick
          </span>
        </div>
      </div>
      
      <!-- Potencial de Gank Rating -->
      <div class="flex flex-col items-center space-y-1 w-full">
        <span class="text-xs text-gray-400 font-medium">Potencial de Gank</span>
        <div class="flex items-center space-x-1">
          <div class="flex space-x-1">
            <div v-for="n in 5" :key="n" 
                 class="w-2 h-2 rounded-full transition-all" 
                 :class="n <= rating ? 'bg-gold-400 shadow-sm shadow-gold-400' : 'bg-gray-600'"
                 :title="`${rating} de 5 estrelas`">
            </div>
          </div>
          <span class="text-xs text-gray-300 ml-1 font-semibold">{{ rating }}/5</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getChampionImageUrl } from '../services/riotApi.js'

const props = defineProps({
  champion: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  championSide: {
    type: Object,
    default: null
  }
})

const championImageUrl = computed(() => {
  return getChampionImageUrl(props.version, props.champion.id)
})

const handleImageError = (event) => {
  // Fallback para imagem padrão se a imagem do campeão não carregar
  event.target.src = 'https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/Ahri.png'
}
</script>