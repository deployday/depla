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
  const libs = [
    {
      name: 'app',
      directory: 'website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/website/app --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'app',
      directory: 'generated/website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/website/app --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'app',
      directory: 'generated/shared',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/shared/app --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'config',
      directory: 'website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/website/config --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'config',
      directory: 'generated/website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/website/config --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'data',
      directory: 'website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/website/data --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'data',
      directory: 'generated/website',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/website/data --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'user',
      directory: 'shared/entities',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/shared/entities/user --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'user',
      directory: 'generated/shared/entities',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/shared/entities/user --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'html',
      directory: 'generated/shared/types',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/shared/types/html --unitTestRunner=none --bundler=tsc`,
    },
    {
      name: 'ui',
      directory: 'shared',
      generatorName: `@nxtensions/astro:lib`,
      flags: `--importPath=@${scope}/shared/ui`,
    },
    {
      name: 'ui',
      directory: 'generated/shared',
      generatorName: `@nxtensions/astro:lib`,
      flags: `--importPath=@${scope}/generated/shared/ui`,
    },
  ];
  entities.forEach((entity) => {
    libs.push({
      name: entity.model,
      directory: 'shared/entities',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/shared/entities/${entity.model} --unitTestRunner=none --bundler=tsc`,
    });
    libs.push({
      name: entity.model,
      directory: 'generated/shared/entities',
      generatorName: `@nrwl/js:lib`,
      flags: `--importPath=@${scope}/generated/shared/entities/${entity.model} --unitTestRunner=none --bundler=tsc`,
    });
  });
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
    libs,
    entities,
    detached: {
      home: homeSchema,
      login: loginSchema,
    },
  };
  return generateWorkspace(config);
};
