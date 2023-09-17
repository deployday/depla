import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  outDir: '../../dist/apps/website',
  output: 'server',
  adapter: netlify({
    dist: new URL('../../dist/apps/website/', import.meta.url),
    // builders: true,
  }),
});
