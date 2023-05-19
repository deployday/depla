import { resolve } from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({
  domain,
  workspace,
  app,
  entity,
}: {
  domain: any;
  workspace: any;
  app: any;
  entity: any;
}) => {
  const libraryExists = fs.existsSync(resolve('./lib/shared/entities'));
  if (libraryExists)
    console.log(chalk.green(`prisma astro stack is already installed`));

  return {
    runBefore: !libraryExists && [
      [
        `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        data --directory=website --importPath=@${workspace.scope}/website/data \
         --bundler=tsc --unitTestRunner=none`,
      ],
    ],
    runAfter: [`npx prisma migrate dev --name init`],
    writingInjections: {
      // providers: [
      //   {
      //     name: 'db',
      //     module: `${workspace.scope}/data-provider`,
      //   },
      // ],
    },
  };
};
