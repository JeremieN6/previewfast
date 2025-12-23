<template>
  <section class="mySection section-design-4" aria-label="Design 4">
    <div class="container-design">
      <!-- Screen 1 -->
      <div 
        class="myScreen-design-4 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 1 }"
        data-screen="1" 
        aria-label="Ecran 1"
        @click="selectScreen(1)"
      >
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-1">
          <div class="mockup-wrapper-design-4" data-screen="1">
            <img src="/assets/mockup/adam-mockup-9.png" alt="mockup-iphone" class="mockup-iphone-design-4">
            <img :src="imageFor(1)" alt="visual" class="visual-on-mockup">
          </div>
        </div>
      </div>

      <!-- Screen 2 -->
      <div 
        class="myScreen-design-4 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 2 }"
        data-screen="2" 
        aria-label="Ecran 2"
        @click="selectScreen(2)"
      >
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-2">
          <div class="mockup-wrapper-design-4" data-screen="2">
            <img src="/assets/mockup/adam-mockup-9.png" alt="mockup-iphone" class="mockup-iphone-design-4">
            <img :src="imageFor(2)" alt="visual" class="visual-on-mockup">
          </div>
        </div>
      </div>

      <!-- Screen 3 -->
      <div 
        class="myScreen-design-4 myScreen-design-4--jumbo screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 3 }"
        data-screen="3" 
        aria-label="Ecran 3"
        @click="selectScreen(3)"
      >
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-3">
          <img src="/assets/mockup/adam-mockup-4.png" alt="mockup-iphone" class="mockup-iphone-design-4">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(3)" alt="visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 4 -->
      <div 
        class="myScreen-design-4 myScreen-design-4--jumbo screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 4 }"
        data-screen="4" 
        aria-label="Ecran 4"
        @click="selectScreen(4)"
      >
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-4">
          <img src="/assets/mockup/adam-mockup-5.png" alt="mockup-iphone" class="mockup-iphone-design-4">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(4)" alt="visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 5 -->
      <div 
        class="myScreen-design-4 myScreen-design-4--jumbo screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 5 }"
        data-screen="5" 
        aria-label="Ecran 5"
        @click="selectScreen(5)"
      >
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-5">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="mockup-iphone" class="mockup-iphone-design-4 mockup-iphone-design-4-screen-5">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(5)" alt="visual" class="visual-on-mockup">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useBuilderStore } from '../../store/builderStore'
import designConfig from '../../../configs/designs/design-4.json'

export default {
  name: 'Design4',
  props: {
    screensCount: {
      type: Number,
      default: 5
    },
    selectedScreenId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      config: designConfig,
      store: useBuilderStore(),
      fallbackImages: {
        1: '/assets/tmp/screenshot1.jpg',
        2: '/assets/tmp/screenshot1.jpg',
        3: '/assets/tmp/screenshot.jpg',
        4: '/assets/tmp/screenshot.jpg',
        5: '/assets/tmp/screenshot.jpg'
      }
    }
  },
  computed: {
    screenshotUrls() {
      return this.store.state.screenshots.map((s) => s.url)
    },
    hasEnoughShots() {
      return this.screenshotUrls.length >= 5
    }
  },
  methods: {
    selectScreen(screenNum) {
      this.$emit('screen-selected', screenNum)
    },
    imageFor(screenNum) {
      if (this.hasEnoughShots) {
        const primary = this.screenshotUrls[0]
        // Design 4: les écrans 1 et 2 doivent rester identiques, et les écrans 3/4 réutilisent aussi l'image 1
        if ([1, 2, 3, 4].includes(screenNum)) {
          return primary
        }
        return this.screenshotUrls[(screenNum - 1) % this.screenshotUrls.length]
      }
      return this.fallbackImages[screenNum] || '/assets/tmp/screenshot.jpg'
    }
  },
  mounted() {
    console.log(`[${this.config.name}] Configuration chargée:`, this.config)
  }
}
</script>

<style scoped>
.screen-selectable {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.screen-selectable:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  pointer-events: none;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
}

.screen-selected::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.15);
  pointer-events: none;
  border: 3px solid #3b82f6;
  border-radius: 8px;
}
</style>
