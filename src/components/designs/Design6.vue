<template>
  <section class="mySection section-design-6" aria-label="Design 6">
    <div class="container-design">
      <!-- Screen 1 -->
      <article 
        class="myScreen-design-6 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 1 }"
        data-tone="sunset" 
        data-align="top" 
        data-screen="1" 
        aria-label="Design 6 · Ecran 1"
        @click="selectScreen(1)"
      >
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image tilt-left">
          <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone incliné" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(1)" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 2 -->
      <article 
        class="myScreen-design-6 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 2 }"
        data-tone="mono" 
        data-align="bottom" 
        data-screen="2" 
        aria-label="Design 6 · Ecran 2"
        @click="selectScreen(2)"
      >
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image frame2 framed">
          <img src="/assets/mockup/adam-mockup-1bis.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(2)" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 3 -->
      <article 
        class="myScreen-design-6 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 3 }"
        data-tone="ocean" 
        data-align="top" 
        data-screen="3" 
        aria-label="Design 6 · Ecran 3"
        @click="selectScreen(3)"
      >
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image tilt-right">
          <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone incliné" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(3)" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 4 -->
      <article 
        class="myScreen-design-6 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 4 }"
        data-tone="mono" 
        data-align="top" 
        data-layout="invert" 
        data-screen="4" 
        data-variant="tall" 
        aria-label="Design 6 · Ecran 4"
        @click="selectScreen(4)"
      >
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image framed">
          <img src="/assets/mockup/adam-mockup-1bis.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <img :src="imageFor(4)" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 5 -->
      <article 
        class="myScreen-design-6 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 5 }"
        data-tone="design6_screen5" 
        data-align="top" 
        data-screen="5" 
        aria-label="Design 6 · Ecran 5"
        @click="selectScreen(5)"
      >
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image straight">
          <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(5)" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { useBuilderStore } from '../../store/builderStore'
import designConfig from '../../../configs/designs/design-6.json'

export default {
  name: 'Design6',
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
      store: useBuilderStore()
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
      return '/assets/tmp/screenshot.jpg'
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
