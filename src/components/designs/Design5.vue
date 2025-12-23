<template>
  <section class="mySection section-design-5" aria-label="Design 5">
    <div class="container-design">
      <!-- Screen 1 -->
      <div 
        class="myScreen-design-5 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 1 }"
        data-screen="1" 
        data-variant="lavender logo" 
        data-notch="55" 
        aria-label="Ecran 1"
        @click="selectScreen(1)"
      >
        <div class="design-5-text">
        <span class="design-5-logo">
            <img src="https://placehold.co/40x40/003941/FFFFFF?text=LOGO" alt="Logo application">
        </span>
          <h3>You can put headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(1)" alt="visual" class="visual-on-mockup" />
        </div>
      </div>

      <!-- Screen 2 -->
      <div 
        class="myScreen-design-5 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 2 }"
        data-screen="2" 
        data-variant="dark top-heavy" 
        data-notch="20" 
        data-screenshot="design5screen2" 
        aria-label="Ecran 2"
        @click="selectScreen(2)"
      >
        <div class="design-5-text">
          <h3>You can put headline here</h3>
          <p>Awesome headline here</p>
        </div>
        <div class="design-5-mockup">
            <img src="/assets/mockup/adam-mockup-1bis.png" class="img-mockup" alt="Mockup iPhone">
            <span class="default-design-notch" aria-hidden="true"></span>
            <img :src="imageFor(2)" alt="visual" class="visual-on-mockup">            
        </div>
      </div>

      <!-- Screen 3 -->
      <div 
        class="myScreen-design-5 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 3 }"
        data-screen="3" 
        data-variant="lavender upFontSize" 
        data-notch="55" 
        aria-label="Ecran 3"
        @click="selectScreen(3)"
      >
        <div class="design-5-text">
          <h3 class="upFontSize">You can put awesome headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(3)" alt="visual" class="visual-on-mockup" />
        </div>
      </div>

      <!-- Screen 4 -->
      <div 
        class="myScreen-design-5 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 4 }"
        data-screen="4" 
        data-variant="dark inverted" 
        data-notch="30" 
        aria-label="Ecran 4"
        @click="selectScreen(4)"
      >
        <div class="design-5-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-1bis.png" class="img-mockup" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(4)" alt="visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 5 -->
      <div 
        class="myScreen-design-5 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 5 }"
        data-screen="5" 
        data-variant="lavender" 
        data-notch="55" 
        aria-label="Ecran 5"
        @click="selectScreen(5)"
      >
        <div class="design-5-text">
          <h3>You can put headline here</h3>
          <p>Put your awesome headline here</p>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(5)" alt="visual" class="visual-on-mockup" />            
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useBuilderStore } from '../../store/builderStore'
import designConfig from '../../../configs/designs/design-5.json'

export default {
  name: 'Design5',
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
        1: '/assets/tmp/screenshot.jpg',
        2: '/assets/tmp/screenshot.jpg',
        3: '/assets/tmp/screenshot.jpg',
        4: '/assets/tmp/screenshot1.jpg',
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
