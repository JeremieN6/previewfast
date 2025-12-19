<template>
  <section class="mySection section-design-2" aria-label="Design 2">
    <div class="container-design">
      <div 
        v-for="screenNum in screensCount" 
        :key="screenNum"
        class="myScreen-design-2" 
        :data-screen="screenNum" 
        :aria-label="`Ecran ${screenNum}`"
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
          <!--<img v-if="screenNum === 1" src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">-->
        <img src="/assets/tmp/screenshot1.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Design2',
  props: {
    screensCount: {
      type: Number,
      default: 5
    }
  }
}
</script>
