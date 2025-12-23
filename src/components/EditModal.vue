<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="close">
    <div class="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
      <div class="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">Édition</p>
          <h3 class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">Modifier l'écran {{ screenData.id }}</h3>
        </div>
        <button
          type="button"
          class="inline-flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-gray-700"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div class="space-y-6">
          <div
            v-for="zone in screenData.editableZones"
            :key="zone.id"
            class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
          >
              <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ zone.id }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">Type : {{ zone.type }}</p>
              </div>
                <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
                  {{ displayAllowed(zone).join(', ') }}
              </span>
            </div>

            <!-- BACKGROUND ZONES -->
            <div v-if="zone.type === 'background'" class="mt-4 space-y-4">
              <div v-if="zone.allowed.includes('color')" class="space-y-2">
                <label :for="`${zone.id}-color`" class="text-sm font-medium text-gray-800 dark:text-gray-100">Couleur unie</label>
                <div class="flex items-center gap-3">
                  <input
                    type="color"
                    :id="`${zone.id}-color`"
                    :value="getColorValue(zone)"
                    @input="updateZone(zone.id, $event.target.value, 'color')"
                    class="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  />
                  <input
                    type="text"
                    :value="localEdits[zone.id]?.type === 'color' ? localEdits[zone.id]?.value : getColorValue(zone)"
                    @input="updateZone(zone.id, $event.target.value, 'color')"
                    placeholder="#000000"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cliquez sur le carré de couleur ou entrez un code hex (#RRGGBB).</p>
              </div>

              <div v-if="zone.allowed.includes('gradient')" class="space-y-2">
                <label :for="`${zone.id}-gradient`" class="text-sm font-medium text-gray-800 dark:text-gray-100">Dégradé CSS</label>
                <textarea
                  :id="`${zone.id}-gradient`"
                  :value="localEdits[zone.id]?.type === 'gradient' ? localEdits[zone.id]?.value : (zone.current.includes('gradient') ? zone.current : '')"
                  @input="updateZone(zone.id, $event.target.value, 'gradient')"
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  rows="2"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                ></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400">Exemples : linear-gradient(135deg, #667eea 0%, #764ba2 100%)</p>
              </div>
            </div>

            <!-- TEXT ZONES -->
            <div v-if="zone.type === 'text' && zone.allowed.includes('edit')" class="mt-4 space-y-2">
              <label :for="`${zone.id}-text`" class="text-sm font-medium text-gray-800 dark:text-gray-100">
                Texte
                <span v-if="zone.maxLines" class="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                  (Max {{ zone.maxLines }} ligne{{ zone.maxLines > 1 ? 's' : '' }})
                </span>
                <span v-if="zone.maxChars" class="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                  (Max {{ zone.maxChars }} caractères)
                </span>
              </label>
              <textarea
                :id="`${zone.id}-text`"
                :value="localEdits[zone.id]?.value || zone.current"
                @input="updateZone(zone.id, $event.target.value, 'text', zone)"
                :maxlength="zone.maxChars"
                rows="3"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              ></textarea>
              <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span v-if="zone.maxLines">Ne pas dépasser {{ zone.maxLines }} ligne{{ zone.maxLines > 1 ? 's' : '' }}.</span>
                <span v-if="zone.maxChars">{{ (localEdits[zone.id]?.value || zone.current).length }} / {{ zone.maxChars }} caractères.</span>
              </div>
            </div>

            <!-- IMAGE ZONES -->
            <div v-if="zone.type === 'image'" class="mt-4 space-y-4">
              <div v-if="isMockupZone(zone)" class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/30 dark:text-amber-100">
                Mockup protégé : cette image n'est pas modifiable.
              </div>

              <template v-else>
                <div v-if="zone.allowed.includes('upload')" class="space-y-2">
                  <label :for="`${zone.id}-upload`" class="text-sm font-medium text-gray-800 dark:text-gray-100">Upload nouvelle image</label>
                  <input
                    type="file"
                    :id="`${zone.id}-upload`"
                    accept="image/*"
                    @change="handleImageUpload(zone.id, $event)"
                    class="block w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>

                <div v-if="zone.allowed.includes('replace')" class="space-y-2">
                  <label :for="`${zone.id}-url`" class="text-sm font-medium text-gray-800 dark:text-gray-100">URL de l'image</label>
                  <input
                    type="text"
                    :id="`${zone.id}-url`"
                    :value="localEdits[zone.id]?.value || zone.current"
                    @input="updateZone(zone.id, $event.target.value, 'url')"
                    placeholder="https://..."
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/70">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="apply"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Appliquer
          </button>
          <button
            type="button"
            @click="applyToAll"
            :disabled="!hasCompatibleZones"
            :title="compatibleZonesTooltip"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-900"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Appliquer à tous
            <span v-if="!canApplyGlobal" class="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">PRO</span>
          </button>
        </div>
        <button
          type="button"
          @click="close"
          class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Annuler
        </button>
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
    canApplyGlobal() {
      const userPlan = getUserPlan()
      return userPlan === 'pro' || canAccess(userPlan, 'canApplyGlobalChanges')
    },

    compatibleZones() {
      if (!this.designConfig || !this.localEdits || Object.keys(this.localEdits).length === 0) {
        return []
      }

      const modifiedZones = Object.keys(this.localEdits)
      const allScreens = this.designConfig.screens || []

      return modifiedZones.filter((zoneId) =>
        allScreens.every((screen) => screen.editableZones.some((zone) => zone.id === zoneId))
      )
    },

    hasCompatibleZones() {
      return this.compatibleZones.length > 0 && this.canApplyGlobal
    },

    compatibleZonesTooltip() {
      if (!this.canApplyGlobal) {
        return 'Fonctionnalité réservée au plan Pro'
      }

      if (!this.hasCompatibleZones) {
        return 'Aucune modification compatible avec tous les écrans'
      }

      const count = this.compatibleZones.length
      const zones = this.compatibleZones.join(', ')
      return `${count} zone(s) compatible(s) : ${zones}`
    }
  },
  methods: {
    isMockupZone(zone) {
      return zone?.type === 'image' && zone?.id?.toLowerCase().includes('mockup')
    },

    isLockedZoneId(zoneId) {
      const zone = this.screenData?.editableZones?.find((z) => z.id === zoneId)
      return this.isMockupZone(zone)
    },

    displayAllowed(zone) {
      return this.isMockupZone(zone) ? ['verrouillé'] : zone.allowed
    },

    sanitizeEdits(edits) {
      if (!edits) return {}
      const cleaned = { ...edits }
      Object.keys(cleaned).forEach((zoneId) => {
        if (this.isLockedZoneId(zoneId)) {
          delete cleaned[zoneId]
        }
      })
      return cleaned
    },

    getColorValue(zone) {
      if (this.localEdits[zone.id]?.type === 'color') {
        return this.localEdits[zone.id].value
      }

      const current = zone.current || ''
      if (current.startsWith('#')) {
        return current
      }

      return '#000000'
    },

    updateZone(zoneId, value, type) {
      if (this.isLockedZoneId(zoneId)) return
      this.localEdits[zoneId] = { value, type }
    },

    handleImageUpload(zoneId, event) {
      if (this.isLockedZoneId(zoneId)) return
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        this.updateZone(zoneId, e.target.result, 'upload')
      }
      reader.readAsDataURL(file)
    },

    apply() {
      const cleaned = this.sanitizeEdits(this.localEdits)
      this.$emit('apply-changes', cleaned)
      this.localEdits = {}
      this.close()
    },

    applyToAll() {
      if (!this.canApplyGlobal) {
        this.$emit('upgrade-required', 'applyGlobalChanges')
        return
      }

      if (!this.hasCompatibleZones) {
        window.alert('Aucune modification compatible avec tous les écrans')
        return
      }

      const cleaned = this.sanitizeEdits(this.localEdits)
      const compatibleEdits = {}
      this.compatibleZones.forEach((zoneId) => {
        if (cleaned[zoneId]) {
          compatibleEdits[zoneId] = cleaned[zoneId]
        }
      })

      const count = this.compatibleZones.length
      const zones = this.compatibleZones.join(', ')
      const confirmAction = window.confirm(
        `Appliquer ces modifications à TOUS les écrans du design ?\n\n` +
          `${count} zone(s) seront modifiées : ${zones}\n\n` +
          `Cela affectera les 5 écrans de ce design.`
      )

      if (!confirmAction) return

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
</style>
