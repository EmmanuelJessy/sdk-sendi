// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';      // ✅ IMPORT AJOUTÉ
import terser from '@rollup/plugin-terser';

export default [
  // Configuration ES Module
  {
    input: 'src/index.js',
    external: ['axios'],  
    output: {
      file: 'dist/sendi-api.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      globals: {
      axios: 'axios'  // ✅ AJOUTER
    }
    },
    plugins: [
      json(),      // ✅ AJOUTÉ DANS TOUS LES PLUGINS
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ]
  },
  // Configuration CommonJS
  {
    input: 'src/index.js',
    output: {
      file: 'dist/sendi-api.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      json(),      // ✅ AJOUTÉ
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ]
  },
  // Configuration UMD (pour navigateur)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/sendi-api.umd.js',
      format: 'umd',
      name: 'SendiAPI',
      sourcemap: true,
      exports: 'named',
      globals: {
        axios: 'axios'
      }
    },
    plugins: [
      json(),      // ✅ AJOUTÉ
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      terser()
    ]
  }
];