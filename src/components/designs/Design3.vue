<template>
  <section class="mySection section-design-3" aria-label="Design 3">
    <div class="container-design">
      <div 
        v-for="screenNum in screensCount" 
        :key="screenNum"
        class="myScreen-design-3" 
        :data-screen="screenNum" 
        :aria-label="`Ecran ${screenNum}`"
      >
        <div class="container-logo container-logo-design-3">
          <img src="https://placehold.co/40x40/003941/FFFFFF?text=LOGO" alt="logo" class="content-logo content-logo-design-3">
        </div>
        <div class="container-text-design-3">
          <h3 class="titleScreen titleScreen-design-3">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-3">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="mockup-iphone" class="mockup-iphone-design-3">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import designConfig from '../../../configs/designs/design-3.json'

export default {
  name: 'Design3',
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
