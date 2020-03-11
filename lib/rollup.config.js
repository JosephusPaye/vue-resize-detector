import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    // browser-friendly UMD build
    input: 'ResizeDetector.js',
    output: {
      name: 'VueResizeDetector',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [resolve(), commonjs(), buble(), terser()],
  },
  {
    // CommonJS (for Node) and ES module (for bundlers)
    input: 'ResizeDetector.js',
    external: [
      'lodash/debounce',
      'lodash/throttle',
      'raf-schd',
      'resize-observer-polyfill',
    ],
    plugins: [resolve(), commonjs(), buble(), terser()],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
