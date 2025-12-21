<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Presets - {{ designId }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez vos configurations réutilisables
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
      
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex">
          <button
            @click="activeTab = 'save'"
            :class="[
              'flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === 'save'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            💾 Sauvegarder
          </button>
          <button
            @click="activeTab = 'load'"
            :class="[
              'flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === 'load'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            📂 Charger
          </button>
          <button
            @click="activeTab = 'manage'"
            :class="[
              'flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === 'manage'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            ⚙️ Gérer ({{ presets.length }})
          </button>
        </div>
      </div>
      
      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(85vh-220px)]">
        <!-- Tab: Sauvegarder -->
        <div v-if="activeTab === 'save'">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du preset
              </label>
              <input
                v-model="newPresetName"
                type="text"
                placeholder="Ex: Thème sombre, Setup marketing..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="handleSavePreset"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Portée du preset
              </label>
              <div class="flex gap-3">
                <button
                  @click="newPresetScope = 'screen'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-lg border-2 transition-all',
                    newPresetScope === 'screen'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  ]"
                >
                  <div class="text-left">
                    <div class="font-medium text-gray-900 dark:text-white">Écran uniquement</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Valeurs de l'écran {{ currentScreen }}
                    </div>
                  </div>
                </button>
                
                <button
                  @click="newPresetScope = 'design'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-lg border-2 transition-all',
                    newPresetScope === 'design'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  ]"
                >
                  <div class="text-left">
                    <div class="font-medium text-gray-900 dark:text-white">Design complet</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Zones communes à tous les écrans
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <div v-if="currentEdits && Object.keys(currentEdits).length > 0" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p class="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                ✓ Modifications détectées
              </p>
              <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
                <div v-for="(edit, zoneId) in currentEdits" :key="zoneId">
                  • {{ zoneId }}: {{ edit.type }}
                </div>
              </div>
            </div>
            
            <div v-else class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ℹ️ Aucune modification à sauvegarder. Modifiez d'abord un écran avant de créer un preset.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Tab: Charger -->
        <div v-if="activeTab === 'load'">
          <div v-if="presets.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">
              Aucun preset disponible
            </p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Créez votre premier preset dans l'onglet "Sauvegarder"
            </p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="preset in presets"
              :key="preset.id"
              class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
              @click="handleLoadPreset(preset)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ preset.name }}
                    </h4>
                    <span :class="[
                      'text-xs px-2 py-0.5 rounded-full',
                      preset.scope === 'screen'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    ]">
                      {{ preset.scope === 'screen' ? `Écran ${preset.screenNum}` : 'Design' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ Object.keys(preset.values).length }} zone(s) • {{ formatDate(preset.createdAt) }}
                  </p>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-2 flex flex-wrap gap-1">
                    <span v-for="zoneId in Object.keys(preset.values).slice(0, 5)" :key="zoneId" class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {{ zoneId }}
                    </span>
                    <span v-if="Object.keys(preset.values).length > 5" class="text-gray-500">
                      +{{ Object.keys(preset.values).length - 5 }}
                    </span>
                  </div>
                </div>
                
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tab: Gérer -->
        <div v-if="activeTab === 'manage'">
          <div v-if="presets.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">
              Aucun preset à gérer
            </p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="preset in presets"
              :key="preset.id"
              class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ preset.name }}
                    </h4>
                    <span :class="[
                      'text-xs px-2 py-0.5 rounded-full',
                      preset.scope === 'screen'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    ]">
                      {{ preset.scope === 'screen' ? `Écran ${preset.screenNum}` : 'Design' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ Object.keys(preset.values).length }} zone(s) • {{ formatDate(preset.createdAt) }}
                  </p>
                </div>
                
                <button
                  @click="handleDeletePreset(preset.id)"
                  class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer ce preset"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
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
          Fermer
        </button>
        
        <button
          v-if="activeTab === 'save'"
          @click="handleSavePreset"
          :disabled="!canSavePreset"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
            canSavePreset
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Sauvegarder le preset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDesignPresets, savePreset, deletePreset } from '../utils/presets.js'

export default {
  name: 'PresetModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    designId: {
      type: String,
      default: null
    },
    currentScreen: {
      type: [String, Number],
      default: null
    },
    currentEdits: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeTab: 'load',
      newPresetName: '',
      newPresetScope: 'screen',
      presets: []
    }
  },
  computed: {
    canSavePreset() {
      return this.newPresetName.trim().length > 0 && 
             this.currentEdits && 
             Object.keys(this.currentEdits).length > 0
    }
  },
  methods: {
    loadPresets() {
      if (this.designId) {
        this.presets = getDesignPresets(this.designId)
      }
    },
    
    handleSavePreset() {
      if (!this.canSavePreset) return
      
      try {
        const preset = savePreset(
          this.designId,
          this.newPresetName,
          this.newPresetScope,
          this.currentEdits,
          this.newPresetScope === 'screen' ? this.currentScreen : null
        )
        
        // Rafraîchir la liste
        this.loadPresets()
        
        // Réinitialiser le formulaire
        this.newPresetName = ''
        
        // Passer à l'onglet "Charger"
        this.activeTab = 'load'
        
        alert(`✅ Preset "${preset.name}" sauvegardé avec succès !`)
      } catch (error) {
        alert(`❌ Erreur lors de la sauvegarde: ${error.message}`)
      }
    },
    
    handleLoadPreset(preset) {
      const confirm = window.confirm(
        `Charger le preset "${preset.name}" ?\n\n` +
        `Cela appliquera ${Object.keys(preset.values).length} modification(s)${preset.scope === 'design' ? ' à tous les écrans compatibles' : ''}.`
      )
      
      if (!confirm) return
      
      this.$emit('load-preset', preset)
    },
    
    handleDeletePreset(presetId) {
      const preset = this.presets.find(p => p.id === presetId)
      
      const confirm = window.confirm(
        `Supprimer le preset "${preset.name}" ?\n\n` +
        `Cette action est irréversible.`
      )
      
      if (!confirm) return
      
      if (deletePreset(this.designId, presetId)) {
        this.loadPresets()
        alert('✅ Preset supprimé')
      } else {
        alert('❌ Erreur lors de la suppression')
      }
    },
    
    formatDate(isoString) {
      const date = new Date(isoString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'À l\'instant'
      if (diffMins < 60) return `Il y a ${diffMins} min`
      if (diffHours < 24) return `Il y a ${diffHours}h`
      if (diffDays < 7) return `Il y a ${diffDays}j`
      
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue) {
        this.loadPresets()
      } else {
        // Réinitialiser quand la modal se ferme
        this.newPresetName = ''
        this.activeTab = 'load'
      }
    }
  }
}
</script>
