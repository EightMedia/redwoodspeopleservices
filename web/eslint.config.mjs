import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      // Internal links are plain <a> elements on purpose (full-page navigation, no router
      // prefetching): the site is small, mostly static and the Kikker Link atom does the same.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]);

export default eslintConfig;
