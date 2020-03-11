<template>
  <div id="app" class="h-screen w-screen">
    <div class="max-w-5xl p-6 mx-auto relative">
      <div class="inline-block relative leading-none">
        <textarea
          disabled
          class="resize bg-gray-700 w-full border-box overflow-hidden"
          cols="30"
          rows="10"
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
        observe-width
        observe-height
        refresh-mode="debounce"
        :refresh-rate="1000"
        @resize="onResize"
        target="textarea"
      >
        <template v-slot="{ width, height }">
          <div
            class="flex items-center justify-center bg-gray-800 absolute left-0 top-0 mt-6 ml-6 pointer-events-none"
            :style="{ width: `${width}px`, height: `${height}px` }"
          >
            <div class="font-light text-3xl text-gray-300">
              {{ Math.round(width) }}px × {{ Math.round(height) }}px
            </div>
          </div>
        </template>
      </ResizeDetector>
    </div>
  </div>
</template>

<script>
import ResizeDetector from '../lib/dist/vue-resize-detector.umd.js';

export default {
  name: 'App',
  components: { ResizeDetector },
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
