import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true
  },
  kit: {
    alias: {
      $generated: './src/generated'
    }
  }
};
