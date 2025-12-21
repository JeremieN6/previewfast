<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Modifier l'écran {{ screenData.id }}</h3>
        <button @click="close" class="modal-close">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div v-for="zone in screenData.editableZones" :key="zone.id" class="zone-editor">
          <h4 class="zone-title">{{ zone.id }}</h4>
          <p class="zone-type">Type: {{ zone.type }}</p>
          
          <!-- BACKGROUND ZONES -->
          <div v-if="zone.type === 'background'" class="field-group">
            <div v-if="zone.allowed.includes('color')" class="field">
              <label :for="`${zone.id}-color`">Couleur unie</label>
              <div class="color-picker-wrapper">
                <input 
                  type="color" 
                  :id="`${zone.id}-color`"
                  :value="getColorValue(zone)"
                  @input="updateZone(zone.id, $event.target.value, 'color')"
                  class="color-input"
                />
                <input 
                  type="text" 
                  :value="localEdits[zone.id]?.type === 'color' ? localEdits[zone.id]?.value : getColorValue(zone)"
                  @input="updateZone(zone.id, $event.target.value, 'color')"
                  placeholder="#000000"
                  class="color-text-input"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
              <small class="field-hint">Cliquez sur le carré de couleur ou entrez un code hex (#RRGGBB)</small>
            </div>
            
            <div v-if="zone.allowed.includes('gradient')" class="field">
              <label :for="`${zone.id}-gradient`">Dégradé CSS</label>
              <textarea 
                :id="`${zone.id}-gradient`"
                :value="localEdits[zone.id]?.type === 'gradient' ? localEdits[zone.id]?.value : (zone.current.includes('gradient') ? zone.current : '')"
                @input="updateZone(zone.id, $event.target.value, 'gradient')"
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                rows="2"
                class="gradient-input"
              ></textarea>
              <small class="field-hint">Exemples:
                <br>• linear-gradient(135deg, #667eea 0%, #764ba2 100%)
                <br>• radial-gradient(circle, #f00, #00f)
              </small>
            </div>
          </div>
          
          <!-- TEXT ZONES -->
          <div v-if="zone.type === 'text' && zone.allowed.includes('edit')" class="field-group">
            <div class="field">
              <label :for="`${zone.id}-text`">
                Texte
                <span v-if="zone.maxLines" class="max-lines-hint">
                  (Max {{ zone.maxLines }} ligne{{ zone.maxLines > 1 ? 's' : '' }})
                </span>
                <span v-if="zone.maxChars" class="max-chars-hint">
                  (Max {{ zone.maxChars }} caractères)
                </span>
              </label>
              <textarea 
                :id="`${zone.id}-text`"
                :value="localEdits[zone.id]?.value || zone.current"
                @input="updateZone(zone.id, $event.target.value, 'text', zone)"
                :maxlength="zone.maxChars"
                rows="3"
              ></textarea>
              <small v-if="zone.maxLines" class="field-hint">
                Attention : Ne pas dépasser {{ zone.maxLines }} ligne{{ zone.maxLines > 1 ? 's' : '' }} pour préserver le design.
              </small>
              <small v-if="zone.maxChars" class="field-hint">
                {{ (localEdits[zone.id]?.value || zone.current).length }} / {{ zone.maxChars }} caractères
              </small>
            </div>
          </div>
          
          <!-- IMAGE ZONES -->
          <div v-if="zone.type === 'image'" class="field-group">
            <div v-if="zone.allowed.includes('upload')" class="field">
              <label :for="`${zone.id}-upload`">Upload nouvelle image</label>
              <input 
                type="file" 
                :id="`${zone.id}-upload`"
                accept="image/*"
                @change="handleImageUpload(zone.id, $event)"
              />
            </div>
            
            <div v-if="zone.allowed.includes('replace')" class="field">
              <label :for="`${zone.id}-url`">URL de l'image</label>
              <input 
                type="text" 
                :id="`${zone.id}-url`"
                :value="localEdits[zone.id]?.value || zone.current"
                @input="updateZone(zone.id, $event.target.value, 'url')"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="flex items-center gap-3">
          <button @click="apply" class="btn-primary">Appliquer</button>
          <button 
            @click="applyToAll" 
            class="btn-apply-all"
            :disabled="!hasCompatibleZones"
            :title="compatibleZonesTooltip"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
            Appliquer à tous
            <span v-if="!canApplyGlobal" class="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full ml-1">PRO</span>
          </button>
        </div>
        <button @click="close" class="btn-secondary">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPlan, canAccess } from '../utils/planManager.js'

export default {
  name: 'EditModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    screenData: {
      type: Object,
      default: () => ({ id: '', editableZones: [] })
    },
    designConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      localEdits: {}
    }
  },
  computed: {
    // Vérifier si l'utilisateur peut utiliser "Appliquer à tous"
    canApplyGlobal() {
      const userPlan = getUserPlan()
      return userPlan === 'pro' || canAccess(userPlan, 'canApplyGlobalChanges')
    },
    
    // Analyser les zones communes entre tous les écrans
    compatibleZones() {
      if (!this.designConfig || !this.localEdits || Object.keys(this.localEdits).length === 0) {
        return []
      }
      
      const modifiedZones = Object.keys(this.localEdits)
      const allScreens = this.designConfig.screens || []
      
      // Pour chaque zone modifiée, vérifier si elle existe dans tous les écrans
      return modifiedZones.filter(zoneId => {
        return allScreens.every(screen => {
          return screen.editableZones.some(zone => zone.id === zoneId)
        })
      })
    },
    
    hasCompatibleZones() {
      return this.compatibleZones.length > 0 && this.canApplyGlobal
    },
    
    compatibleZonesTooltip() {
      if (!this.canApplyGlobal) {
        return "Fonctionnalité réservée au plan Pro"
      }
      
      if (!this.hasCompatibleZones) {
        return "Aucune modification compatible avec tous les écrans"
      }
      
      const count = this.compatibleZones.length
      const zones = this.compatibleZones.join(', ')
      return `${count} zone(s) compatible(s) : ${zones}`
    }
  },
  methods: {
    getColorValue(zone) {
      // Si on a une modification locale de type color, l'utiliser
      if (this.localEdits[zone.id]?.type === 'color') {
        return this.localEdits[zone.id].value
      }
      
      // Sinon, extraire la couleur de la valeur actuelle si c'est un hex
      const current = zone.current || ''
      if (current.startsWith('#')) {
        return current
      }
      
      // Si c'est un gradient ou autre, retourner une couleur par défaut
      return '#000000'
    },
    
    updateZone(zoneId, value, type) {
      this.localEdits[zoneId] = { value, type }
    },
    
    handleImageUpload(zoneId, event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.updateZone(zoneId, e.target.result, 'upload')
        }
        reader.readAsDataURL(file)
      }
    },
    
    apply() {
      this.$emit('apply-changes', this.localEdits)
      this.localEdits = {}
      this.close()
    },
    
    applyToAll() {
      // Vérifier d'abord l'accès
      if (!this.canApplyGlobal) {
        this.$emit('upgrade-required', 'applyGlobalChanges')
        return
      }
      
      if (!this.hasCompatibleZones) {
        alert('Aucune modification compatible avec tous les écrans')
        return
      }
      
      // Filtrer pour ne garder que les modifications compatibles
      const compatibleEdits = {}
      this.compatibleZones.forEach(zoneId => {
        compatibleEdits[zoneId] = this.localEdits[zoneId]
      })
      
      // Confirmation
      const count = this.compatibleZones.length
      const zones = this.compatibleZones.join(', ')
      const confirm = window.confirm(
        `Appliquer ces modifications à TOUS les écrans du design ?\n\n` +
        `${count} zone(s) seront modifiées : ${zones}\n\n` +
        `Cela affectera les 5 écrans de ce design.`
      )
      
      if (!confirm) return
      
      // Émettre l'événement avec les modifications compatibles
      this.$emit('apply-to-all', compatibleEdits)
      this.localEdits = {}
      this.close()
    },
    
    close() {
      this.localEdits = {}
      this.$emit('close')
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.localEdits = {}
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.zone-editor {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.zone-editor:last-child {
  border-bottom: none;
}

.zone-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.zone-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.field input[type="text"],
.field input[type="color"],
.field textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.color-picker-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  padding: 0.25rem;
  cursor: pointer;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.color-text-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: monospace;
}

.gradient-input {
  font-family: monospace;
  font-size: 0.8rem;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: -0.25rem;
}

.field input[type="color"] {
  height: 40px;
  cursor: pointer;
}

.field input[type="file"] {
  font-size: 0.875rem;
}

.field textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
}

.btn-primary,
.btn-secondary,
.btn-apply-all {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-apply-all {
  background: #8b5cf6;
  color: white;
}

.btn-apply-all:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-apply-all:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Hints pour les limites de lignes/caractères */
.max-lines-hint,
.max-chars-hint {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
  margin-left: 0.5rem;
}
</style>
