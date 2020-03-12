<template>
  <div id="app" class="h-screen w-screen">
    <div class="max-w-5xl p-6 mx-auto">
      <div class="border-b border-gray-800 pt-8 pb-10">
        <div class="font-light text-4xl text-white">Vue Resize Detector</div>
        <p class="text-gray-400 text-base mt-3 text-xl">
          Detect and handle element size changes in Vue using ResizeObservers
          for optimal performance.
        </p>
        <a
          href="https://github.com/JosephusPaye/vue-resize-detector"
          rel="noopener"
          target="_blank"
          class="text-lg rounded-full py-3 px-8 inline-flex leading-none mt-5 bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
          >Documentation</a
        >
      </div>

      <div class="flex min-w-0 mt-12">
        <div class="flex">
          <CheckButton :checked.sync="observeWidth">Observe width</CheckButton>
          <CheckButton :checked.sync="observeHeight" class="ml-1"
            >Observe height</CheckButton
          >
        </div>

        <div class="mx-auto">
          <ToggleButton :value.sync="rateLimiter">No limit</ToggleButton>
          <ToggleButton id="debounce" :value.sync="rateLimiter"
            >Debounce</ToggleButton
          >
          <ToggleButton id="throttle" :value.sync="rateLimiter"
            >Throttle</ToggleButton
          >
        </div>

        <div
          class="flex items-center"
          :class="{ 'opacity-50': rateLimiter === undefined }"
        >
          <span
            class="bg-gray-800 px-4 inline-flex items-center justify-center text-white h-full cursor-default"
            >Rate limit:</span
          >
          <input
            type="number"
            step="100"
            v-model.number="rateLimit"
            :disabled="rateLimiter === undefined"
            class="ml-auto w-32 px-3 py-1 bg-gray-700 text-black h-full text-white"
          />
        </div>
      </div>

      <div class="py-6 text-gray-500 text-lg">
        Drag the bottom right corner of the box below to resize.
      </div>

      <div class="relative">
        <div class="relative inline-block leading-none">
          <textarea
            disabled
            class="resize bg-gray-700 w-full border-box overflow-hidden"
            cols="300"
            rows="12"
          ></textarea>
          <div
            class="absolute top-0 left-0 right-0 bottom-0 border border-gray-500 pointer-events-none z-10"
          ></div>
          <svg
            viewBox="0 0 24 24"
            class="pointer-events-none text-gray-500 absolute bottom-0 right-0 z-10 w-6 h-6 mb-px"
          >
            <path
              fill="currentColor"
              d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"
            />
          </svg>
        </div>
        <ResizeDetector
          target="textarea"
          :observe-width="observeWidth"
          :observe-height="observeHeight"
          :rate-limiter="rateLimiter"
          :rate-limit="rateLimit"
          @resize="onResize"
          v-slot="{ width, height }"
        >
          <div
            class="flex items-center justify-center bg-gray-800 absolute left-0 top-0 pointer-events-none"
            :style="{ width: `${width}px`, height: `${height}px` }"
          >
            <span class="font-light text-3xl text-gray-300"
              >{{ Math.round(width) }}px × {{ Math.round(height) }}px</span
            >
          </div>
        </ResizeDetector>
      </div>
    </div>
  </div>
</template>

<script>
import ResizeDetector from 'vue-resize-detector';
import CheckButton from './CheckButton.vue';
import ToggleButton from './ToggleButton.vue';

export default {
  name: 'App',
  components: { CheckButton, ToggleButton, ResizeDetector },
  data() {
    return {
      observeWidth: true,
      observeHeight: true,
      rateLimiter: undefined,
      rateLimit: 1000,
    };
  },
  methods: {
    onResize(width, height) {
      console.log('onResize', width, height);
    },
  },
};
</script>

<style>
@import './tailwind.css';

body {
  @apply bg-gray-900;
}
</style>
