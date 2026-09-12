// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

// ✅ Modules externes (non bundlés)
const external = ['axios'];

// ✅ Modules Node.js à ignorer (pour le navigateur)
const nodeBuiltins = [
  'util', 'stream', 'path', 'http', 'https', 'url', 'fs', 'crypto',
  'net', 'tls', 'assert', 'tty', 'os', 'events', 'http2', 'zlib'
];

// ✅ Globals pour UMD (navigateur)
const globals = {
  axios: 'axios'
};

export default [
  // ============================================
  // Configuration ES Module (moderne)
  // ============================================
  {
    input: 'src/index.js',
    external: [...external, ...nodeBuiltins],
    output: {
      file: 'dist/sendi-api.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
        browser: false  // ✅ Node.js d'abord
      }),
      commonjs()
    ]
  },

  // ============================================
  // Configuration CommonJS (Node.js)
  // ============================================
  {
    input: 'src/index.js',
    external: [...external, ...nodeBuiltins],
    output: {
      file: 'dist/sendi-api.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
        browser: false
      }),
      commonjs()
    ]
  },

  // ============================================
  // Configuration UMD (navigateur)
  // ============================================
  {
    input: 'src/index.js',
    external: [...external, ...nodeBuiltins],
    output: {
      file: 'dist/sendi-api.umd.js',
      format: 'umd',
      name: 'SendiAPI',
      sourcemap: true,
      exports: 'named',
      globals: globals,
      // ✅ Ignorer les modules Node.js dans le navigateur
      interop: 'auto'
    },
    plugins: [
      json(),
      resolve({
        preferBuiltins: false,  // ✅ Navigateur d'abord
        browser: true
      }),
      commonjs(),
      terser()
    ]
  }
];