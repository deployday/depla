import { resolve } from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = (workspace: any) => {
  const libraryExists = fs.existsSync(resolve('./libs/website/data'));
  if (libraryExists)
    console.log(
      chalk.green(
        `data slice is already installed in ${workspace.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: !libraryExists && [
      [
        `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @nrwl/js`,
      ],
      [
        `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        data --directory=website --importPath=@${workspace.name}/website/data \
         --bundler=tsc --unitTestRunner=none`,
      ],
    ],
    runAfter: [''],
  };
};
