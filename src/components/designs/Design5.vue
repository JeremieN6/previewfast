<template>
  <section class="mySection section-design-5" aria-label="Design 5">
    <div class="container-design">
      <!-- Screen 1 -->
      <div class="myScreen-design-5" data-screen="1" data-variant="lavender logo" data-notch="55" aria-label="Ecran 1">
        <div class="design-5-text">
        <span class="design-5-logo">
            <img src="https://placehold.co/40x40/003941/FFFFFF?text=LOGO" alt="Logo application">
        </span>
          <h3>You can put headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="../../../public/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="../../../public/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </div>

      <!-- Screen 2 -->
      <div class="myScreen-design-5" data-screen="2" data-variant="dark top-heavy" data-notch="20" data-screenshot="design5screen2" aria-label="Ecran 2">
        <div class="design-5-text">
          <h3>You can put headline here</h3>
          <p>Awesome headline here</p>
        </div>
        <div class="design-5-mockup">
            <img src="../../../public/assets/mockup/adam-mockup-1bis.png" class="img-mockup" alt="Mockup iPhone">
            <span class="default-design-notch" aria-hidden="true"></span>
            <img src="../../../public/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup">            
        </div>
      </div>

      <!-- Screen 3 -->
      <div class="myScreen-design-5" data-screen="3" data-variant="lavender upFontSize" data-notch="55" aria-label="Ecran 3">
        <div class="design-5-text">
          <h3 class="upFontSize">You can put awesome headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </div>

      <!-- Screen 4 -->
      <div class="myScreen-design-5" data-screen="4" data-variant="dark inverted" data-notch="30" aria-label="Ecran 4">
        <div class="design-5-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-1bis.png" class="img-mockup" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot1.jpg" alt="default-visual" class="visual-on-mockup">
        </div>
      </div>

      <!-- Screen 5 -->
      <div class="myScreen-design-5" data-screen="5" data-variant="lavender" data-notch="55" aria-label="Ecran 5">
        <div class="design-5-text">
          <h3>You can put headline here</h3>
          <p>Put your awesome headline here</p>
        </div>
        <div class="design-5-mockup">
          <img src="/assets/mockup/adam-mockup-2bis.png" alt="Mockup iPhone" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />            
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Design5',
  props: {
    screensCount: {
      type: Number,
      default: 5
    }
  }
}
</script>
