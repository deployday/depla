import { resolve } from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({
  domain,
  workspace,
}: {
  domain: any;
  workspace: any;
}) => {
  const libraryExists = fs.existsSync(resolve('./prisma'));
  if (libraryExists)
    console.log(chalk.green(`prisma stack is already installed`));

  const ret = {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i prisma@4.11.0`,

          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @depla/utils-db@latest`,

          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes prisma init --datasource-provider sqlite`,

          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        prisma --directory=shared --importPath=${workspace.scope}/shared/prisma \
         --bundler=tsc --unitTestRunner=none`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        prisma --directory=shared/generated --importPath=${workspace.scope}/shared/generated/prisma \
         --bundler=tsc --unitTestRunner=none`,
        ]
      : [],
    runAfter: [`npx prisma migrate dev --name init`],
    writingInjections: {
      providers: [
        {
          name: 'db',
          module: `@depla/utils-db`,
        },
      ],
    },
  };
  console.log('JSUT BEFORE RET', ret);
  return ret;
};
