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
            v-for="zone in visibleZones"
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
                <label class="text-sm font-medium text-gray-800 dark:text-gray-100">Dégradé</label>

                <div class="flex flex-wrap items-center gap-4">
                  <!-- Orientation -->
                  <div class="flex items-center gap-2">
                    <div
                      class="gradient-knob"
                      :ref="`knob-${zone.id}`"
                      @mousedown.prevent="startKnobDrag(zone.id, zone, $event)"
                      @touchstart.prevent="startKnobDrag(zone.id, zone, $event)"
                    >
                      <div class="gradient-knob__dot" :style="getKnobDotStyle(zone.id, zone)"></div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="360"
                      :value="getGradientState(zone).angle"
                      @input="onAngleInput(zone.id, zone, $event.target.value)"
                      class="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                    />
                  </div>

                  <!-- Couleurs -->
                  <div class="flex flex-wrap items-center gap-4">
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Couleur début</span>
                      <div class="flex items-center gap-2">
                        <input
                          type="color"
                          :value="getGradientState(zone).startColor"
                          @input="onColorInput(zone.id, zone, 'startColor', $event.target.value)"
                          class="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        />
                        <input
                          type="text"
                          :value="getGradientState(zone).startColor"
                          @input="onColorInput(zone.id, zone, 'startColor', $event.target.value)"
                          class="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                          placeholder="#FF0000"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Couleur fin</span>
                      <div class="flex items-center gap-2">
                        <input
                          type="color"
                          :value="getGradientState(zone).endColor"
                          @input="onColorInput(zone.id, zone, 'endColor', $event.target.value)"
                          class="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        />
                        <input
                          type="text"
                          :value="getGradientState(zone).endColor"
                          @input="onColorInput(zone.id, zone, 'endColor', $event.target.value)"
                          class="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                          placeholder="#0000FF"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Aperçu -->
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Résultat</span>
                    <div
                      class="gradient-preview rounded-lg ring-1 ring-gray-200 dark:ring-gray-700"
                      :style="{ background: buildGradientValue(getGradientState(zone)) }"
                    ></div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    v-for="(example, idx) in gradientExamples"
                    :key="`g-${idx}`"
                    type="button"
                    class="gradient-swatch ring-1 ring-gray-200 transition hover:scale-105 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:ring-gray-700 dark:hover:ring-blue-500"
                    :style="{ background: buildGradientValue(example) }"
                    @click="applyGradientExample(zone.id, zone, example)"
                  ></button>
                </div>
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
              <template v-if="!isMockupZone(zone)">
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
      localEdits: {},
      gradientState: {},
      activeKnob: null,
      gradientExamples: [
        { angle: 120, startColor: '#4f7c87', endColor: '#f2e15c' },
        { angle: 90, startColor: '#0b033a', endColor: '#3cb5ff' },
        { angle: 60, startColor: '#f6a53a', endColor: '#48c2b1' },
        { angle: 130, startColor: '#9ab0e8', endColor: '#e0b0c7' }
      ]
    }
  },
  computed: {
    visibleZones() {
      return (this.screenData?.editableZones || []).filter((zone) => !this.isMockupZone(zone))
    },

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
    getGradientState(zone) {
      const existing = this.gradientState[zone.id]
      if (existing) return existing

      const source =
        this.localEdits[zone.id]?.type === 'gradient'
          ? this.localEdits[zone.id]?.value
          : zone.current && zone.current.includes('gradient')
          ? zone.current
          : ''

      const parsed = this.parseGradient(source)
      this.gradientState = { ...this.gradientState, [zone.id]: parsed }
      return parsed
    },

    parseGradient(value) {
      const fallback = { angle: 135, startColor: '#667eea', endColor: '#764ba2' }
      if (!value || typeof value !== 'string' || !value.includes('gradient')) return fallback

      try {
        const inner = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')'))
        const parts = inner.split(',').map((p) => p.trim()).filter(Boolean)

        let angle = 135
        let colors = parts

        if (parts[0]?.includes('deg')) {
          const parsedAngle = parseFloat(parts[0])
          angle = Number.isNaN(parsedAngle) ? 135 : parsedAngle % 360
          colors = parts.slice(1)
        }

        const start = colors[0]?.split(' ')[0] || fallback.startColor
        const end = colors[1]?.split(' ')[0] || fallback.endColor

        return {
          angle,
          startColor: this.normalizeColor(start, fallback.startColor),
          endColor: this.normalizeColor(end, fallback.endColor)
        }
      } catch (e) {
        return fallback
      }
    },

    normalizeColor(value, fallback) {
      if (!value) return fallback
      const trimmed = value.trim()
      const hex6 = /^#?[0-9a-fA-F]{6}$/
      const hex3 = /^#?[0-9a-fA-F]{3}$/

      if (hex6.test(trimmed)) return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
      if (hex3.test(trimmed)) return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
      return fallback
    },

    buildGradientValue(state) {
      const angle = Math.round(state?.angle ?? 135)
      const start = state?.startColor || '#667eea'
      const end = state?.endColor || '#764ba2'
      return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`
    },

    updateGradient(zoneId, zone, partialState = {}) {
      const current = this.getGradientState(zone)
      const next = { ...current, ...partialState }
      this.gradientState = { ...this.gradientState, [zoneId]: next }
      this.updateZone(zoneId, this.buildGradientValue(next), 'gradient')
    },

    onAngleInput(zoneId, zone, rawValue) {
      const numeric = Number(rawValue)
      const angle = Number.isNaN(numeric) ? 0 : Math.max(0, Math.min(360, numeric))
      this.updateGradient(zoneId, zone, { angle })
    },

    onColorInput(zoneId, zone, key, value) {
      const normalized = this.normalizeColor(value, this.getGradientState(zone)[key])
      this.updateGradient(zoneId, zone, { [key]: normalized })
    },

    applyGradientExample(zoneId, zone, example) {
      const { angle = 135, startColor, endColor } = example
      this.updateGradient(zoneId, zone, {
        angle,
        startColor: startColor || '#667eea',
        endColor: endColor || '#764ba2'
      })
    },

    startKnobDrag(zoneId, zone, event) {
      this.activeKnob = { zoneId, zone }
      document.addEventListener('mousemove', this.handleKnobMove)
      document.addEventListener('mouseup', this.stopKnobDrag)
      document.addEventListener('touchmove', this.handleKnobMove, { passive: false })
      document.addEventListener('touchend', this.stopKnobDrag)
      this.handleKnobMove(event)
    },

    handleKnobMove(event) {
      if (!this.activeKnob) return

      const { zoneId, zone } = this.activeKnob
      const refEl = this.$refs[`knob-${zoneId}`]
      const knobEl = Array.isArray(refEl) ? refEl[0] : refEl
      if (!knobEl) return

      const rect = knobEl.getBoundingClientRect()
      const clientX = event.touches ? event.touches[0].clientX : event.clientX
      const clientY = event.touches ? event.touches[0].clientY : event.clientY
      const dx = clientX - (rect.left + rect.width / 2)
      const dy = clientY - (rect.top + rect.height / 2)

      const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360
      this.updateGradient(zoneId, zone, { angle: Math.round(angle) })

      if (event.preventDefault) {
        event.preventDefault()
      }
    },

    stopKnobDrag() {
      this.activeKnob = null
      document.removeEventListener('mousemove', this.handleKnobMove)
      document.removeEventListener('mouseup', this.stopKnobDrag)
      document.removeEventListener('touchmove', this.handleKnobMove)
      document.removeEventListener('touchend', this.stopKnobDrag)
    },

    getKnobDotStyle(zoneId, zone) {
      const state = this.getGradientState(zone)
      const radius = 26
      const center = 32
      const rad = ((state.angle ?? 0) - 90) * (Math.PI / 180)
      const x = center + radius * Math.cos(rad)
      const y = center + radius * Math.sin(rad)
      return { left: `${x}px`, top: `${y}px` }
    },

    isMockupZone(zone) {
      return zone?.type === 'image' && zone?.id?.toLowerCase().includes('mockup')
    },

    isLockedZoneId(zoneId) {
      const zone = this.screenData?.editableZones?.find((z) => z.id === zoneId)
      return this.isMockupZone(zone)
    },

    displayAllowed(zone) {
      return zone.allowed
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
      this.gradientState = {}
      this.stopKnobDrag()
      this.$emit('close')
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.localEdits = {}
        this.gradientState = {}
        this.stopKnobDrag()
      }
    }
  },
  beforeUnmount() {
    this.stopKnobDrag()
  }
}
</script>

<style scoped>
.gradient-knob {
  position: relative;
  width: 64px;
  height: 64px;
  border: 3px solid #233445;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #f8fafc, #e2e8f0);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  cursor: grab;
  touch-action: none;
}

.gradient-knob__dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #0f172a;
  border: 3px solid #ffffff;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.gradient-preview {
  width: 100px;
  height: 40px;
}

.gradient-swatch {
  width: 64px;
  height: 40px;
  border-radius: 12px;
}
</style>
