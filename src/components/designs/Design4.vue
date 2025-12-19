<template>
  <section class="mySection section-design-4" aria-label="Design 4">
    <div class="container-design">
      <!-- Screen 1 -->
      <div class="myScreen-design-4" data-screen="1" aria-label="Ecran 1">
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-1">
          <div class="mockup-wrapper-design-4" data-screen="1">
            <img src="/assets/mockup/adam-mockup-9.png" alt="mockup-iphone" class="mockup-iphone-design-4">
            <img src="/assets/tmp/screenshot1.jpg" alt="default-visual" class="visual-on-mockup">
          </div>
        </div>
      </div>

      <!-- Screen 2 -->
      <div class="myScreen-design-4" data-screen="2" aria-label="Ecran 2">
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-2">
          <div class="mockup-wrapper-design-4" data-screen="2">
            <img src="/assets/mockup/adam-mockup-9.png" alt="mockup-iphone" class="mockup-iphone-design-4">
            <img src="/assets/tmp/screenshot1.jpg" alt="default-visual" class="visual-on-mockup">
          </div>
        </div>
      </div>

      <!-- Screen 3 -->
      <div class="myScreen-design-4 myScreen-design-4--jumbo" data-screen="3" aria-label="Ecran 3">
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-3">
          <img src="/assets/mockup/adam-mockup-4.png" alt="mockup-iphone" class="mockup-iphone-design-4">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 4 -->
      <div class="myScreen-design-4 myScreen-design-4--jumbo" data-screen="4" aria-label="Ecran 4">
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-4">
          <img src="/assets/mockup/adam-mockup-5.png" alt="mockup-iphone" class="mockup-iphone-design-4">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 5 -->
      <div class="myScreen-design-4 myScreen-design-4--jumbo" data-screen="5" aria-label="Ecran 5">
        <div class="container-text-design-4">
          <h3 class="titleScreen titleScreen-design-4">
            Lorem ipsum sit amet
          </h3>
        </div>
        <div class="container-img-design-4 container-img-design-4-screen-5">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="mockup-iphone" class="mockup-iphone-design-4 mockup-iphone-design-4-screen-5">
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import designConfig from '../../../configs/designs/design-4.json'

export default {
  name: 'Design4',
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
