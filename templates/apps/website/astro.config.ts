// @ts-nocheck
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import unocss from '@unocss/astro';
import presetWind from '@unocss/preset-wind';
import { presetDaisy } from 'unocss-preset-daisy';
import presetTagify from '@unocss/preset-tagify';
import presetWebFonts from '@unocss/preset-web-fonts';
import presetTypography from '@unocss/preset-typography';
import transformerDirectives from '@unocss/transformer-directives';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from '<%= scope %>/shared/util/astro-plugin-predict-reading-time';
import { app } from '<%= scope %>/shared/app';
import { inject } from '<%= scope %>/shared/util/astro-plugin-inject';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  app.config.googleAnalyticsId
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: app.env('WEBSITE_BASE_URL'),
  base: app.config.basePathname,
  trailingSlash: app.config.trailingSlash ? 'always' : 'never',

  output: 'static',

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  outDir: '../../dist/apps/website',
  integrations: [
    unocss({
      presets: [
        presetWind(),
        presetTagify({
          extraProperties: (matched) =>
            matched.startsWith('i-') ? { display: 'inline-block' } : {},
        }),
        presetDaisy(),
        presetTypography(),
        presetWebFonts({
          fonts: {
            // these will extend the default theme
            sans: 'InterVariable',
            mono: ['Fira Code', 'Fira Mono:400,700'],
            // custom ones
            handwritten: [
              {
                name: 'Shadows Into Light Two',
                cursive: true,
              },
            ],
            'text-page': [
              {
                name: 'InterVariable',
              },
              {
                name: 'sans-serif',
                provider: 'none',
              },
            ],
          },
        }),
      ],
      safelist: [
        /* this you can use to exclude utilities from purge */
      ],
      theme: {
        colors: {
          primary: 'var(--aw-color-primary)',
          textPage: 'var(--aw-color-text-page)',
          textMuted: 'var(--aw-color-text-muted)',
          bgPage: 'var(--aw-color-bg-page)',
          secondary: 'var(--aw-color-secondary)',
          accent: 'var(--aw-color-accent)',
        },
      },
      // rules: {
      //   ':root': [
      //     { '--aw-color-primary': 'rgb(30, 64, 175)' },
      //     { '--aw-color-secondary': 'rgb(30, 58, 138)' },
      //     { '--aw-color-accent': 'rgb(11, 245, 142)' },
      //     { '--aw-color-text-page': 'rgb(17, 24, 39)' },
      //     { '--aw-color-text-muted': 'rgb(75, 85, 99)' },
      //     { '--aw-color-bg-page': 'rgb(255, 255, 255)' },
      //   ],
      //
      //   // /^(?:font|fw)-?([^-]+)$/
      // },
      transformers: [transformerDirectives()],
      shortcuts: {
        '#header.scroll':
          'shadow-md md:shadow-lg bg-white md:bg-white/90 md:backdrop-blur-sm dark:bg-slate-900 dark:md:bg-slate-900/90',

        ['text-page']: 'c-text-page font-text-page',

        ['text-muted']: 'c-text-muted',

        ['bg-light']: 'bg-bg-page',

        ['bg-dark']: 'bg-slate-900',

        ['btn']:
          'inline-flex items-center justify-center rounded-full shadow-md border-gray-400 border bg-transparent font-medium text-center text-page leading-snug transition py-3.5 px-6 md:px-8 ease-in duration-200 focus:ring-blue-500 focus:ring-offset-blue-200 focus:ring-2 focus:ring-offset-2 hover:bg-gray-100 hover:border-gray-600 dark:text-slate-300 dark:border-slate-500 dark:hover:bg-slate-800 dark:hover:border-slate-800',

        ['btn-ghost']:
          'border-none shadow-none c-text-muted hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',

        ['btn-primary']:
          'font-semibold bg-primary text-white border-primary hover:bg-blue-900 hover:border-blue-900 hover:text-white dark:text-white dark:bg-primary dark:border-primary dark:hover:border-blue-900 dark:hover:bg-blue-900',
      },
    }),
    react(),
    inject({
      filePath: '<%= scope %>/website/app/src/lib/_ssr-bootstrap.ts',
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@cms': path.resolve(
          __dirname,
          '../../libs/shared/ui/src/lib/react/cms.jsx'
        ),
        '@layout': path.resolve(
          __dirname,
          '../../libs/shared/ui/src/lib/layouts/'
        ),
      },
    },
    server: {
      fs: {
        allow: [path.resolve(__dirname, '../../')],
      },
    },
  },
});
