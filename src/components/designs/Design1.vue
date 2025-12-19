<template>
  <section class="mySection" aria-label="Design 1">
    <div class="container-design">
      <div 
        v-for="screenNum in screensCount" 
        :key="screenNum"
        class="myScreen-design-1" 
        :data-screen="screenNum" 
        :aria-label="`Ecran ${screenNum}`"
      >
        <div class="container-img">
          <img src="/assets/mockup/adam-mockup-1.png" alt="mockup-iphone-design-1" class="mockup-iphone-design-1">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
        <div class="container-text-design-1">
          <h3 class="titleScreen titleScreen-design-1">
            Lorem ipsum sit amet consectetur
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import designConfig from '../../../configs/designs/design-1.json'

export default {
  name: 'Design1',
  props: {
    screensCount: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      config: designConfig
    }
  },
  mounted() {
    console.log(`[${this.config.name}] Configuration chargée:`, this.config)
  }
}
</script>
