import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import rafSchd from 'raf-schd';
import ResizeObserver from 'resize-observer-polyfill';

const rateLimitFunctions = {
  debounce,
  throttle,
};

const getRateLimiter = type => rateLimitFunctions[type];

const isDOMElement = element =>
  element instanceof Element || element instanceof HTMLDocument;

export default {
  name: 'ResizeDetector',

  props: {
    target: {
      type: [String, Element],
      default: undefined,
    },
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
    rateLimiter: {
      type: String,
      default: undefined,
    },
    rateLimit: {
      type: Number,
      default: 1000,
    },
    rateLimitOptions: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      width: 0,
      height: 0,
    };
  },

  watch: {
    rateLimiter() {
      this.clearObserver();
      this.initObserver();
    },

    rateLimit() {
      if (this.rateLimiter) {
        this.clearObserver();
        this.initObserver();
      }
    },

    rateLimitOptions() {
      if (this.rateLimiter) {
        this.clearObserver();
        this.initObserver();
      }
    },
  },

  render() {
    return this.$scopedSlots.default
      ? this.$scopedSlots.default({
          width: this.width,
          height: this.height,
        })
      : undefined;
  },

  mounted() {
    this.isInitialMount = true;
    this.initObserver();
  },

  beforeDestroy() {
    this.clearObserver();
  },

  methods: {
    initObserver() {
      const {
        rateLimiter: rateLimiterName,
        rateLimit,
        rateLimitOptions,
      } = this;
      const rateLimiter = getRateLimiter(rateLimiterName);

      this.resizeHandler = rateLimiter
        ? rateLimiter(this.createResizeHandler, rateLimit, rateLimitOptions)
        : this.createResizeHandler;

      this.resizeObserver = new ResizeObserver(this.resizeHandler);

      this.toggleObserver('observe');
    },

    clearObserver() {
      this.toggleObserver('unobserve');
      this.cancelRaf();
      this.cancelHandler();
    },

    cancelHandler() {
      if (this.resizeHandler && this.resizeHandler.cancel) {
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
          updater({
            width: widthChanged ? width : this.width,
            height: heightChanged ? height : this.height,
          });
        }

        this.isInitialMount = false;
      });
    },
  },
};
