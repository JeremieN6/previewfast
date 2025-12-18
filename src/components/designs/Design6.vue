<template>
  <section class="mySection section-design-6" aria-label="Design 6">
    <div class="container-design">
      <!-- Screen 1 -->
      <article class="myScreen-design-6" data-tone="sunset" data-align="top" data-screen="1" aria-label="Design 6 · Ecran 1">
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image tilt-left">
          <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone incliné" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 2 -->
      <article class="myScreen-design-6" data-tone="mono" data-align="bottom" data-screen="2" aria-label="Design 6 · Ecran 2">
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image frame2 framed">
          <img src="/assets/mockup/adam-mockup-1bis.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 3 -->
      <article class="myScreen-design-6" data-tone="ocean" data-align="top" data-screen="3" aria-label="Design 6 · Ecran 3">
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image tilt-right">
          <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone incliné" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 4 -->
      <article class="myScreen-design-6" data-tone="mono" data-align="top" data-layout="invert" data-screen="4" data-variant="tall" aria-label="Design 6 · Ecran 4">
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image framed">
          <img src="/assets/mockup/adam-mockup-1bis.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>

      <!-- Screen 5 -->
      <article class="myScreen-design-6" data-tone="design6_screen5" data-align="top" data-screen="5" aria-label="Design 6 · Ecran 5">
        <div class="design-6-text">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-6-mockup design-6-mockup--image straight">
          <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone" class="mockup-iphone-design-6" />
          <span class="default-design-notch" aria-hidden="true"></span>
          <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Design6',
  props: {
    screensCount: {
      type: Number,
      default: 5
    }
  }
}
</script>
