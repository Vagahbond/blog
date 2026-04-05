import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    prerender: {
      handleHttpError: ({ path, _, message }) => {
        throw new Error(message);
      }
    },
    adapter: adapter()
  },
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx', '.md'] })],
};

export default config;
