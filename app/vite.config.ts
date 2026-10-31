import { defineConfig } from 'vite';

// Relative base: the same build works at /next/ (preview) and at the site root.
export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0, target: 'es2020' },
});
