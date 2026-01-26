<template>
  <section class="bg-gray-50 dark:bg-gray-800 py-12">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-6">
      <div class="mb-10 text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200">Live demo</p>
        <h2 class="mt-4 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl">
          Voyez le rendu en 30 secondes
        </h2>
        <p class="mt-3 text-base text-gray-500 dark:text-gray-400">
          Importez une capture, modifiez le texte et le fond, puis observez la preview se mettre à jour.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div class="w-full max-w-md space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personnalisation rapide</h3>
            <div class="space-y-4">
              <label class="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Texte principal
                <input
                  v-model="titleText"
                  type="text"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                />
              </label>

              <div class="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Couleur de fond
                <div class="flex flex-wrap gap-3">
                  <label class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <input v-model="backgroundMode" type="radio" value="color" />
                    Couleur
                  </label>
                  <label class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <input v-model="backgroundMode" type="radio" value="gradient" />
                    Degrade
                  </label>
                  <label class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <input v-model="backgroundMode" type="radio" value="image" />
                    Image
                  </label>
                </div>
              </div>

              <div v-if="backgroundMode === 'color'" class="space-y-2">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-300">Couleur de fond</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="backgroundColor"
                    type="color"
                    class="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  />
                  <input
                    v-model="backgroundColor"
                    type="text"
                    class="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                  />
                </div>
              </div>

              <div v-if="backgroundMode === 'gradient'" class="space-y-2">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-300">Degrade</label>
                <div class="flex flex-wrap items-center gap-4">
                  <div
                    class="gradient-knob"
                    ref="gradientKnob"
                    @mousedown.prevent="startKnobDrag"
                    @touchstart.prevent="startKnobDrag"
                  >
                    <div class="gradient-knob__dot" :style="knobDotStyle"></div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <input
                      v-model="gradientStart"
                      type="color"
                      class="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <input
                      v-model="gradientEnd"
                      type="color"
                      class="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <input
                      v-model.number="gradientAngle"
                      type="number"
                      min="0"
                      max="360"
                      class="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                    />
                  </div>
                </div>
              </div>

              <div v-if="backgroundMode === 'image'" class="space-y-2">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-300">Image de fond</label>
                <div class="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="block w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800 sm:w-auto"
                    @change="handleBackgroundUpload"
                  />
                  <button
                    v-if="backgroundImageUrl"
                    type="button"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    @click="clearBackgroundImage"
                  >
                    Retirer l'image
                  </button>
                  <span v-if="backgroundImageName" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ backgroundImageName }}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-600 dark:text-gray-300">Image du mockup</label>
                <div class="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="block w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-800 sm:w-auto"
                    @change="handleMockupUpload"
                  />
                  <button
                    v-if="mockupImageUrl"
                    type="button"
                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    @click="clearMockupImage"
                  >
                    Retirer l'image
                  </button>
                  <span v-if="mockupImageName" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ mockupImageName }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex w-full justify-center lg:justify-center">
            <div class="myScreen-design-1" :style="screenStyle">
              <div class="container-img">
                <img
                  src="/assets/mockup/adam-mockup-1.png"
                  alt="mockup-iphone-design-1"
                  class="mockup-iphone-design-1"
                />
                <span class="default-design-notch" aria-hidden="true"></span>
                <img :src="screenshotUrl" alt="visual" class="visual-on-mockup" />
              </div>
              <div class="container-text-design-1">
                <h3 class="titleScreen titleScreen-design-1">{{ titleText }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const titleText = ref('Donne les bénéfices de ton application')
const backgroundMode = ref('gradient')
const backgroundColor = ref('#f87797')
const gradientStart = ref('#f87797')
const gradientEnd = ref('#ffef9e')
const gradientAngle = ref(135)
const gradientKnob = ref(null)
const backgroundImageUrl = ref('')
const backgroundImageName = ref('')
const mockupImageUrl = ref('')
const mockupImageName = ref('')

const screenshotUrl = computed(() => mockupImageUrl.value || '/assets/tmp/screenshot.jpg')
const knobDotStyle = computed(() => {
  const radius = 22
  const center = 32
  const angle = ((gradientAngle.value || 0) - 90) * (Math.PI / 180)
  return {
    left: `${center + radius * Math.cos(angle)}px`,
    top: `${center + radius * Math.sin(angle)}px`
  }
})

const screenStyle = computed(() => {
  if (backgroundMode.value === 'image' && backgroundImageUrl.value) {
    return {
      backgroundImage: `url(${backgroundImageUrl.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }

  if (backgroundMode.value === 'color') {
    return {
      background: backgroundColor.value
    }
  }

  return {
    background: `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value} 0%, ${gradientEnd.value} 100%)`
  }
})

const handleBackgroundUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file || !/image\/(png|jpe?g|webp)$/i.test(file.type)) return
  clearBackgroundImage()
  backgroundImageUrl.value = URL.createObjectURL(file)
  backgroundImageName.value = file.name
}

const clearBackgroundImage = () => {
  if (backgroundImageUrl.value) {
    URL.revokeObjectURL(backgroundImageUrl.value)
  }
  backgroundImageUrl.value = ''
  backgroundImageName.value = ''
}

const handleMockupUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file || !/image\/(png|jpe?g|webp)$/i.test(file.type)) return
  clearMockupImage()
  mockupImageUrl.value = URL.createObjectURL(file)
  mockupImageName.value = file.name
}

const clearMockupImage = () => {
  if (mockupImageUrl.value) {
    URL.revokeObjectURL(mockupImageUrl.value)
  }
  mockupImageUrl.value = ''
  mockupImageName.value = ''
}

const startKnobDrag = (event) => {
  document.addEventListener('mousemove', handleKnobMove)
  document.addEventListener('mouseup', stopKnobDrag)
  document.addEventListener('touchmove', handleKnobMove, { passive: false })
  document.addEventListener('touchend', stopKnobDrag)
  handleKnobMove(event)
}

const handleKnobMove = (event) => {
  if (!gradientKnob.value) return
  const rect = gradientKnob.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  const dx = clientX - (rect.left + rect.width / 2)
  const dy = clientY - (rect.top + rect.height / 2)
  const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360
  gradientAngle.value = Math.round(angle)
  if (event.preventDefault) {
    event.preventDefault()
  }
}

const stopKnobDrag = () => {
  document.removeEventListener('mousemove', handleKnobMove)
  document.removeEventListener('mouseup', stopKnobDrag)
  document.removeEventListener('touchmove', handleKnobMove)
  document.removeEventListener('touchend', stopKnobDrag)
}

onBeforeUnmount(() => {
  clearBackgroundImage()
  clearMockupImage()
  stopKnobDrag()
})
</script>

<style scoped>
.gradient-knob {
  position: relative;
  width: 64px;
  height: 64px;
  border: 3px solid #1f2937;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, #f8fafc, #e2e8f0);
  cursor: grab;
  touch-action: none;
}

.gradient-knob__dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #111827;
  border: 3px solid #ffffff;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}
</style>
