<template>
  <section class="mySection section-design-2" aria-label="Design 2">
    <div class="container-design">
      <div 
        v-for="screenNum in screensCount" 
        :key="screenNum"
        class="myScreen-design-2 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === screenNum }"
        :data-screen="screenNum" 
        :aria-label="`Ecran ${screenNum}`"
        @click="selectScreen(screenNum)"
      >
        <div class="container-text-design-2">
          <h3 class="titleScreen titleScreen-design-2">
            Lorem ipsum sit amet
          </h3>
          <p>
            Lorem ipsum dolor sit amet
          </p>
        </div>
        <div class="container-img-design-2">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="mockup-iphone" class="mockup-iphone-design-2">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img :src="imageFor(screenNum)" alt="visual" class="visual-on-mockup">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useBuilderStore } from '../../store/builderStore'
import designConfig from '../../../configs/designs/design-2.json'

export default {
  name: 'Design2',
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
      return '/assets/tmp/screenshot1.jpg'
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
