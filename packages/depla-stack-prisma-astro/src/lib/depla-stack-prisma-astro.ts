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
  const libraryExists = fs.existsSync(
    resolve(`./lib/shared/entities/${entity?.model}`)
  );
  if (libraryExists)
    console.log(chalk.green(`entity  ${entity?.model} is already installed`));

  return {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.model} --directory=shared/entities --importPath=${workspace.scope}/shared/entities/${entity?.model} \
         --bundler=tsc --unitTestRunner=none`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.model} --directory=shared/generated/entities --importPath=${workspace.scope}/shared/generated/entities/${entity?.model} \
         --bundler=tsc --unitTestRunner=none`,
        ]
      : [],
    runAfter: [`npx prisma migrate dev --name init`],
    writingInjections: {
      providers: [
        {
          name: entity?.model,
          module: `${workspace.scope}/shared/entities/${entity?.model}`,
        },
      ],
    },
  };
};
