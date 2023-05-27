import { resolve } from 'node:path';
import path from 'path';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace, app }: { workspace: any; app: any }) => {
  const appDataDirectoryPath = path.join(
    process.cwd(),
    `libs/${app.name}/data`
  );
  const libraryExists = fs.existsSync(appDataDirectoryPath);
  if (libraryExists)
    console.log(
      chalk.green(
        `data slice is already installed in ${workspace.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: [
      ...(!libraryExists
        ? [
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @nrwl/js@15.7.2`,
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        data --directory=website --importPath=${workspace.scope}/website/data \
         --unitTestRunner=none`,
            `rm -fr ${appDataDirectoryPath}/src`,
          ]
        : []),
    ],
    runAfter: [''],
  };
};
