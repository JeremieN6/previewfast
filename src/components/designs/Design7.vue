<template>
  <section class="mySection section-design-7" aria-label="Design 7">
    <div class="container-design">
      <!-- Screen 1 (double device) -->
      <article 
        class="myScreen-design-7 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 1 }"
        data-shade="aqua" 
        data-screen="1" 
        aria-label="Design 7 · Ecran 1"
        @click="selectScreen(1)"
      >
        <div class="design-7-text design-7-text--solo">
          <h3>You can put headline here</h3>
        </div>
        <div class="design-7-stage design-7-stage--double">
          <div class="design-7-device" data-device="back">
            <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" data-notch="double-back" aria-hidden="true"></span>
            <div class="design-7-visual" data-visual="back">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
          <div class="design-7-device" data-device="front">
            <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" data-notch="double-front" aria-hidden="true"></span>
            <div class="design-7-visual" data-visual="front">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
        </div>
      </article>

      <!-- Screen 2 (step 01) -->
      <article 
        class="myScreen-design-7 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 2 }"
        data-shade="violet" 
        data-screen="2" 
        aria-label="Design 7 · Ecran 2"
        @click="selectScreen(2)"
      >
        <div class="design-7-text">
          <div class="design-7-heading">
            <span class="design-7-step">01</span>
            <h3>This is smart</h3>
          </div>
          <p>Expecto better pigwidgeon again powder turban. Train.</p>
        </div>
        <div class="design-7-stage" data-tilt="left">
          <div class="design-7-device" data-device="single">
            <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" aria-hidden="true"></span>
            <div class="design-7-visual">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
        </div>
      </article>

      <!-- Screen 3 (step 02) -->
      <article 
        class="myScreen-design-7 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 3 }"
        data-shade="orchid" 
        data-screen="3" 
        aria-label="Design 7 · Ecran 3"
        @click="selectScreen(3)"
      >
        <div class="design-7-text">
          <div class="design-7-heading">
            <span class="design-7-step">02</span>
            <h3>The fast way</h3>
          </div>
          <p>Expecto better pigwidgeon again powder turban. Train.</p>
        </div>
        <div class="design-7-stage" data-tilt="right">
          <div class="design-7-device" data-device="single">
            <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" aria-hidden="true"></span>
            <div class="design-7-visual">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
        </div>
      </article>

      <!-- Screen 4 (step 03) -->
      <article 
        class="myScreen-design-7 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 4 }"
        data-shade="amber" 
        data-screen="4" 
        aria-label="Design 7 · Ecran 4"
        @click="selectScreen(4)"
      >
        <div class="design-7-text">
          <div class="design-7-heading">
            <span class="design-7-step">03</span>
            <h3>We have you</h3>
          </div>
          <p>Expecto better pigwidgeon again powder turban. Train.</p>
        </div>
        <div class="design-7-stage" data-tilt="left">
          <div class="design-7-device" data-device="single">
            <img src="/assets/mockup/adam-mockup-4.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" aria-hidden="true"></span>
            <div class="design-7-visual">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
        </div>
      </article>

      <!-- Screen 5 (step 04) -->
      <article 
        class="myScreen-design-7 screen-selectable" 
        :class="{ 'screen-selected': selectedScreenId === 5 }"
        data-shade="emerald" 
        data-screen="5" 
        aria-label="Design 7 · Ecran 5"
        @click="selectScreen(5)"
      >
        <div class="design-7-text">
          <div class="design-7-heading">
            <span class="design-7-step">04</span>
            <h3>Working with us</h3>
          </div>
          <p>Expecto better pigwidgeon again powder turban. Train.</p>
        </div>
        <div class="design-7-stage" data-tilt="right">
          <div class="design-7-device" data-device="single">
            <img src="/assets/mockup/adam-mockup-5.png" alt="Mockup iPhone" class="design-7-mockup" />
            <span class="default-design-notch" aria-hidden="true"></span>
            <div class="design-7-visual">
              <img src="/assets/tmp/screenshot.jpg" alt="default-visual" class="visual-on-mockup" />
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import designConfig from '../../../configs/designs/design-7.json'

export default {
  name: 'Design7',
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
      config: designConfig
    }
  },
  methods: {
    selectScreen(screenNum) {
      this.$emit('screen-selected', screenNum)
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
