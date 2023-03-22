import { generateWorkspace } from './workspace.js';
import { Config, IEntity } from './types.js';
import * as path from 'path';
import { homeSchema, loginSchema } from './entities.js';
import {
  DATA_MODULE,
  STATE_MODULE,
  MATERIAL_MODULE,
  LOGIN_MODULE,
} from './modules.js';

export const createWorkspace = ({
  entities,
  name = 'workshop',
}: {
  entities: IEntity[];
  name: string;
}) => {
  const projectPath = path.resolve(process.cwd() + '/' + name);
  const scope = 'acme';
  const config: Config = {
    name,
    scope,
    packages: [
      {
        packageName: '@nxtensions/astro@sergeylukin/nxtensions#no-integrations',
        isDev: true,
      },
      { packageName: '@nrwl/workspace@15.8.5', isDev: true },
      { packageName: 'nx@15.8.5', isDev: true },
      { packageName: '@nrwl/nx-plugin@15.8.5', isDev: true },
      // Styling
      { packageName: 'unocss-preset-daisy@3.0.1' },
      { packageName: 'daisyui@2.51.5' },
      { packageName: '@unocss/preset-icons@0.50.6' },
      { packageName: '@unocss/preset-tagify@0.50.6' },
      { packageName: '@unocss/preset-web-fonts@0.50.6' },
      { packageName: '@unocss/astro@0.50.6' },
      { packageName: '@unocss/preset-typography@0.50.6' },
      { packageName: '@unocss/preset-wind@0.50.6' },
      { packageName: '@unocss/reset@0.50.6' },
      { packageName: '@unocss/transformer-directives@0.50.6' },
      // Astro
      { packageName: 'esbuild@0.17.10' },
      { packageName: 'zod@3.21.4' },
      { packageName: 'reading-time@1.5.0' },
      // Astro enhancement
      { packageName: '@astrojs/rss@2.1.1', isDev: true },
      { packageName: '@astrolib/seo@0.3.0' },
      { packageName: '@astrolib/analytics@0.3.0' },
      { packageName: 'astro-icon@0.8.0' },
      { packageName: 'prisma@4.11.0' },
      { packageName: '@prisma/client@4.11.0' },
      // Netlify CMS
      { packageName: 'hast-util-raw@8.0.0' },
      { packageName: 'hast-util-sanitize@4.1.0' },
      { packageName: 'hast-util-to-jsx-runtime@1.2.0' },
      { packageName: 'limax@2.1.0' },
      { packageName: 'mdast-util-from-markdown@1.3.0' },
      { packageName: 'mdast-util-mdx-jsx@2.1.2' },
      { packageName: 'mdast-util-to-hast@12.3.0' },
      { packageName: 'micromark-extension-mdx-jsx@1.0.3' },
      { packageName: 'netlify-identity-widget@1.9.2' },
    ],
    apps: [
      {
        appName: 'website',
        generatorName: '@nxtensions/astro',
        flags: '--no-interactive',
      },
    ],
    fonts: ['inter', 'shadows-into-light-two'],
    integrations: [
      {
        integrationName: 'sitemap image mdx partytown',
      },
    ],
    libs: [
      // website
      {
        libName: `app`,
        generatorName: `@nrwl/js:lib`,
        flags: `--directory=website --importPath=@${scope}/website/app --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `config`,
        generatorName: `@nrwl/js:lib`,
        flags: `--directory=website --importPath=@${scope}/website/config --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `data`,
        generatorName: `@nrwl/js:lib`,
        flags: `--directory=website --importPath=@${scope}/website/data --unitTestRunner=vitest --bundler=tsc`,
      },
      // nx
      {
        libName: `nx`,
        generatorName: `@nrwl/nx-plugin:plugin`,
      },
      {
        libName: `dev-astro-with-netlify-cms`,
        generatorName: `@nrwl/nx-plugin:executor`,
        flags: `--project=nx`,
      },

      //shared
      {
        libName: `ui`,
        generatorName: `@nxtensions/astro:lib`,
        flags: `--directory=shared --importPath=@${scope}/shared/ui`,
      },
      {
        libName: `app`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/app --directory=shared --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `post`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/entities/post --directory=shared/entities --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `user`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/entities/user --directory=shared/entities --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `environment`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/types/environment --directory=shared/types --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `html`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/types/html --directory=shared/types --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `IOC`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/IOC --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `astro-collections-facade`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/astro-collections-facade --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `astro-plugin-inject`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/astro-plugin-inject --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `astro-plugin-predict-reading-time`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/astro-plugin-predict-reading-time --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `db`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/db --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `environment`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/environment --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `image`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/image --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `route`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/route --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
      {
        libName: `time`,
        generatorName: `@nrwl/js:lib`,
        flags: `--importPath=@${scope}/shared/util/time --directory=shared/util --unitTestRunner=vitest --bundler=tsc`,
      },
    ],
    entities,
    detached: {
      home: homeSchema,
      login: loginSchema,
    },
  };
  return generateWorkspace(config);
};
