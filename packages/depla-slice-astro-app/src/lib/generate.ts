import { resolve } from 'node:path';
import os from 'os';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace, app }: { workspace: any; app: any }) => {
  const appDirectoryPath = path.join(process.cwd(), `libs/${app.name}/app`);
  const sharedAppDirectoryPath = path.join(process.cwd(), `libs/shared/app`);
  const generatedAppDirectoryPath = path.join(
    process.cwd(),
    `libs/${app.name}/generated/app`
  );
  const sharedGeneratedAppDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/generated/app`
  );
  const libraryExists = fs.existsSync(appDirectoryPath);
  const generatedLibraryExists = fs.existsSync(generatedAppDirectoryPath);
  if (libraryExists)
    console.log(
      chalk.green(
        `app slice is already installed in ${app.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: [
      ...(!libraryExists
        ? [
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i \
          astro@2.3.0 \
          @depla/nx-astro@latest \
          @depla/ioc@latest \
          @depla/utils-astro-collections-facade@latest \
          @depla/utils-image@latest \
          @depla/utils-url@latest \
          unocss-preset-daisy@3.0.1 \
          @unocss/astro@0.50.6 \
          @unocss/preset-wind@0.50.6 \
          @unocss/preset-tagify@0.50.6 \
          @unocss/preset-web-fonts@0.50.6 \
          @unocss/preset-typography@0.50.6 \
          @unocss/transformer-directives@0.50.6 \
          @astrojs/sitemap@1.1.0 \
          @astrojs/rss@2.1.1 \
          @depla/astro-image@0.15.2 \
          @astrojs/mdx@0.17.2 \
          @astrojs/react@2.0.2 \
          @astrojs/partytown@1.0.3 \
          astro-compress@1.1.35 \
          @depla/utils-astro-plugin-predict-reading-time@latest \
          @depla/utils-astro-plugin-inject@latest \
          @astrojs/netlify@2.2.2 \
          @astrojs/node@5.1.1 \
          astro-copy@0.0.8

          esbuild@0.17.10 \
          esbuild-plugin-alias@0.2.1 \
          esbuild-plugin-replace@1.3.0 \
          `,

            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=${app.name} --importPath=${workspace.scope}/${app.name}/app \
         --unitTestRunner=none`,
            `rm -fr ${appDirectoryPath}/src`,
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=shared --importPath=${workspace.scope}/shared/app \
         --unitTestRunner=none`,
            `rm -fr ${sharedAppDirectoryPath}/src`,
          ]
        : []),
      ...(!generatedLibraryExists
        ? [
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=${app.name}/generated --importPath=${workspace.scope}/${app.name}/generated/app \
         --unitTestRunner=none`,
            `rm -fr ${generatedAppDirectoryPath}/src`,

            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=shared/generated --importPath=${workspace.scope}/shared/generated/app \
         --unitTestRunner=none`,
            `rm -fr ${sharedGeneratedAppDirectoryPath}/src`,
          ]
        : []),
    ],
    runAfter: [''],
    writingInjections: {
      gitignorePatterns: [
        '.astro',
        'dev.db',
        'prod.db',
        '.env',
        '.netlify',
        'prisma/generated/',
        'dist/',
      ],
    },
  };
};
