// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://colcranes.com',
  vite: {
    plugins: [tailwindcss()],
    // Inline small per-page styles, while keeping the shared stylesheet cacheable.
    build: { assetsInlineLimit: 8192 },
  },
});
