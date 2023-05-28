import { resolve } from 'node:path';
import path from 'path';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace, app }: { workspace: any; app: any }) => {
  const environmentDirectoryPath = path.join(
    process.cwd(),
    `node_modules/@depla/utils-environment`
  );
  const libraryExists = fs.existsSync(environmentDirectoryPath);
  if (libraryExists)
    console.log(
      chalk.green(
        `environment slice is already installed in ${app.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @depla/utils-environment`,
    ],
    runAfter: [''],
    writingInjections: {
      providers: [
        {
          name: 'env',
          module: `@depla/utils-environment`,
        },
      ],
    },
  };
};
