<template>
  <div id="app" class="h-screen">
    <p>Oh hai</p>
    <ResizeDetector
      observe-height
      @resize="onResize"
      skip-on-mount
    ></ResizeDetector>
  </div>
</template>

<script>
import ResizeDetector from '../lib/src';

export default {
  name: 'App',
  components: { ResizeDetector },
  methods: {
    onResize(width, height) {
      console.log('onresize', width, height);
    },
  },
};
</script>

<style>
@import './assets/tailwind.css';

body {
  color: rgba(0, 0, 0, 0.87);
}
</style>
