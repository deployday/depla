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
        npm i @depla/ioc @depla/utils-astro-collections-facade`,
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @sergeylukin/nxtensions-astro:app ${app.name} --no-interactive`,
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
  };
};
