import { debounce, throttle } from 'lodash';

export const rateLimitFunctions = {
  debounce,
  throttle,
};

export const getHandle = type => rateLimitFunctions[type];

export const isDOMElement = element =>
  element instanceof Element || element instanceof HTMLDocument;
