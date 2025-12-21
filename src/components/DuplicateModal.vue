<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Dupliquer l'écran {{ sourceScreen }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Copier les modifications de cet écran vers un autre
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(80vh-200px)]">
        <!-- Info sur l'écran source -->
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-medium text-blue-900 dark:text-blue-100">
                Écran source : {{ sourceDesign }}, écran {{ sourceScreen }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Les valeurs modifiées seront copiées (textes, images, couleurs, etc.)
              </p>
            </div>
          </div>
        </div>
        
        <!-- Liste des écrans de destination -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sélectionnez l'écran de destination :
          </label>
          
          <div class="space-y-2">
            <button
              v-for="screen in availableScreens"
              :key="screen.id"
              @click="selectedTarget = screen.number"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
                selectedTarget === screen.number
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- Icône écran -->
                  <div :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    selectedTarget === screen.number
                      ? 'bg-blue-100 dark:bg-blue-800'
                      : 'bg-gray-100 dark:bg-gray-600'
                  ]">
                    <svg class="w-6 h-6" :class="selectedTarget === screen.number ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ screen.label }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ screen.isModified ? '⚠️ Écran déjà modifié' : '✓ Aucune modification' }}
                    </p>
                  </div>
                </div>
                
                <!-- Radio visuel -->
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  selectedTarget === screen.number
                    ? 'border-blue-600 dark:border-blue-400'
                    : 'border-gray-300 dark:border-gray-500'
                ]">
                  <div v-if="selectedTarget === screen.number" class="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Warning si écran déjà modifié -->
        <div v-if="targetIsModified" class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <p class="text-sm font-medium text-amber-900 dark:text-amber-100">
                Attention : Cet écran contient déjà des modifications
              </p>
              <p class="text-xs text-amber-700 dark:text-amber-300 mt-1">
                La duplication remplacera toutes les valeurs actuelles.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Annuler
        </button>
        
        <button
          @click="handleDuplicate"
          :disabled="!selectedTarget"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
            selectedTarget
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          Dupliquer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { loadDesignState } from '../utils/persistence.js'

export default {
  name: 'DuplicateModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    sourceDesign: {
      type: String,
      default: null
    },
    sourceScreen: {
      type: [String, Number],
      default: null
    },
    designConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedTarget: null
    }
  },
  computed: {
    availableScreens() {
      if (!this.designConfig || !this.sourceScreen) return []
      
      // Charger l'état sauvegardé pour vérifier les modifications
      const savedState = loadDesignState(this.sourceDesign) || {}
      
      return this.designConfig.screens
        .map(screen => {
          // Extraire le numéro depuis "screen-1", "screen-2", etc.
          const match = screen.id.match(/screen-(\d+)/)
          const screenNumber = match ? parseInt(match[1]) : null
          
          // Exclure l'écran source
          if (screenNumber === parseInt(this.sourceScreen)) return null
          
          // Vérifier si l'écran a des modifications
          const isModified = !!savedState[screen.id]
          
          return {
            id: screen.id,
            number: screenNumber,
            label: screen.label || `Écran ${screenNumber}`,
            isModified
          }
        })
        .filter(screen => screen !== null)
    },
    
    targetIsModified() {
      if (!this.selectedTarget || !this.sourceDesign) return false
      
      const savedState = loadDesignState(this.sourceDesign) || {}
      return !!savedState[`screen-${this.selectedTarget}`]
    }
  },
  methods: {
    handleDuplicate() {
      if (!this.selectedTarget) return
      
      // Confirmation si l'écran cible est déjà modifié
      if (this.targetIsModified) {
        const confirm = window.confirm(
          `L'écran ${this.selectedTarget} contient déjà des modifications.\n\n` +
          `Voulez-vous vraiment le remplacer ?`
        )
        
        if (!confirm) return
      }
      
      this.$emit('duplicate', {
        targetScreen: this.selectedTarget
      })
      
      // Réinitialiser la sélection
      this.selectedTarget = null
    }
  },
  watch: {
    isOpen(newValue) {
      if (!newValue) {
        // Réinitialiser quand la modal se ferme
        this.selectedTarget = null
      }
    }
  }
}
</script>
