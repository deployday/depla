import { resolve } from 'node:path';
import path from 'path';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace, app }: { workspace: any; app: any }) => {
  const appConfigDirectoryPath = path.join(
    process.cwd(),
    `libs/${app.name}/config`
  );
  const generatedAppConfigDirectoryPath = path.join(
    process.cwd(),
    `libs/${app.name}/generated/config`
  );
  const sharedConfigDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/config`
  );
  const generatedSharedConfigDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/generated/config`
  );
  const libraryExists = fs.existsSync(resolve(`./libs/${app.name}/config`));
  if (libraryExists)
    console.log(
      chalk.green(
        `config slice is already installed in ${app.name}. Not all commands will be applied`
      )
    );
  return {
    runBefore: !libraryExists && [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @nrwl/js@15.7.2 @depla/utils-environment`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        config --directory=${app.name} --importPath=${workspace.scope}/${app.name}/config \
         --unitTestRunner=none`,
      `rm -fr ${appConfigDirectoryPath}/src`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        config --directory=${app.name}/generated --importPath=${workspace.scope}/${app.name}/generated/config \
         --unitTestRunner=none`,
      `rm -fr ${generatedAppConfigDirectoryPath}/src`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        config --directory=shared --importPath=${workspace.scope}/shared/config \
         --unitTestRunner=none`,
      `rm -fr ${sharedConfigDirectoryPath}/src`,
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        config --directory=shared/generated --importPath=${workspace.scope}/shared/generated/config \
         --unitTestRunner=none`,
      `rm -fr ${generatedSharedConfigDirectoryPath}/src`,
    ],
    runAfter: [''],
    writingInjections: {
      providers: [
        {
          name: 'config',
          module: `${workspace.scope}/${app.name}/config`,
        },
      ],
    },
  };
};
