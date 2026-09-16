import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  // Served from https://y-naaz.github.io/kit/ on GitHub Pages.
  base: process.env.DEMO_BASE ?? '/',
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
      $generated: resolve('./src/generated')
    }
  }
});
