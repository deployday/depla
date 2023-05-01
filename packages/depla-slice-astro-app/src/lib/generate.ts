import { resolve } from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace, app }: { workspace: any; app: any }) => {
  const libraryExists = fs.existsSync(resolve(`./libs/${app.name}/app`));
  if (libraryExists)
    console.log(
      chalk.green(
        `app slice is already installed in ${app.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: !libraryExists && [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @nrwl/js @depla/ioc @depla/utils-astro-collections-facade`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=${app.name} --importPath=${workspace.scope}/${app.name}/app \
         --bundler=tsc --unitTestRunner=none`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=${app.name}/generated --importPath=${workspace.scope}/${app.name}/generated/app \
         --bundler=tsc --unitTestRunner=none`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=shared --importPath=${workspace.scope}/shared/app \
         --bundler=tsc --unitTestRunner=none`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        app --directory=shared/generated --importPath=${workspace.scope}/shared/generated/app \
         --bundler=tsc --unitTestRunner=none`,
    ],
    runAfter: [''],
  };
};
