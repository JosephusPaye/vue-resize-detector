import ResizeObserver from 'resize-observer-polyfill';
import rafSchd from 'raf-schd';

import { getHandle, isDOMElement } from './utils';

export default {
  name: 'ResizeDetector',

  props: {
    observeWidth: {
      type: Boolean,
      default: false,
    },
    observeHeight: {
      type: Boolean,
      default: false,
    },
    skipOnMount: {
      type: Boolean,
      default: false,
    },
    refreshMode: {
      type: String,
      default: undefined,
    },
    refreshRate: {
      type: Number,
      default: 1000,
    },
    refreshOptions: {
      type: Object,
      default: undefined,
    },
    target: {
      type: [String, Element],
      default: undefined,
    },
  },

  data() {
    return {
      width: undefined,
      height: undefined,
    };
  },

  render() {
    return (
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        width: this.width,
        height: this.height,
      })
    );
  },

  mounted() {
    this.isInitialMount = true;
    this.raf = null;

    this.initObserver();

    this.toggleObserver('observe');
  },

  beforeDestroy() {
    this.toggleObserver('unobserve');
    this.cancelRaf();
    this.cancelHandler();
  },

  methods: {
    initObserver() {
      const { refreshMode, refreshRate, refreshOptions } = this;

      const handle = getHandle(refreshMode);
      this.resizeHandler = handle
        ? handle(this.createResizeHandler, refreshRate, refreshOptions)
        : this.createResizeHandler;

      this.resizeObserver = new ResizeObserver(this.resizeHandler);
    },

    cancelHandler() {
      if (this.resizeHandler && this.resizeHandler.cancel) {
        // cancel debounced handler
        this.resizeHandler.cancel();
        this.resizeHandler = null;
      }
    },

    cancelRaf() {
      if (this.raf && this.raf.cancel) {
        this.raf.cancel();
        this.raf = null;
      }
    },

    toggleObserver(type) {
      const element = this.getElement();

      if (!element || !this.resizeObserver[type]) {
        return;
      }

      this.resizeObserver[type](element);
    },

    getElement() {
      if (this.$isServer) {
        return undefined;
      }

      const target = this.target;

      if (typeof target === 'string') {
        return document.querySelector(target);
      }

      if (target && isDOMElement(target)) {
        return target;
      }

      // Falls back to the component's parent in the DOM
      return this.$el.parentElement;
    },

    createUpdater() {
      this.cancelRaf();

      this.raf = rafSchd(({ width, height }) => {
        this.width = width;
        this.height = height;
        this.$emit('resize', width, height);
      });

      return this.raf;
    },

    createResizeHandler(entries) {
      const { observeWidth, observeHeight } = this;

      if (!observeWidth && !observeHeight) {
        return;
      }

      const updater = this.createUpdater();

      entries.forEach(entry => {
        if (this.$isServer || (this.isInitialMount && this.skipOnMount)) {
          this.isInitialMount = false;
          return;
        }

        const { width, height } = (entry && entry.contentRect) || {};

        const widthChanged = observeWidth && this.width !== width;
        const heightChanged = observeHeight && this.height !== height;

        if (widthChanged || heightChanged) {
          updater({ width, height });
        }

        this.isInitialMount = false;
      });
    },
  },
};
