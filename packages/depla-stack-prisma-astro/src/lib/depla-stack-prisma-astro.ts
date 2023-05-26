import path from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

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
  const entityDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/entities/${entity?.ref}`
  );
  const libraryExists = fs.existsSync(entityDirectoryPath);
  if (libraryExists)
    console.log(chalk.green(`entity  ${entity?.model} is already installed`));

  return {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.ref} --directory=shared/entities --importPath=${workspace.scope}/shared/entities/${entity?.ref} \
         --unitTestRunner=none`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.ref} --directory=shared/generated/entities --importPath=${workspace.scope}/shared/generated/entities/${entity?.ref} \
         --unitTestRunner=none`,
        ]
      : [],
    runAfter: [
      ...(!libraryExists ? [`npx prisma migrate dev --name init`] : []),
    ],
    writingInjections: {
      providers: [
        {
          name: entity?.ref,
          module: `${workspace.scope}/shared/entities/${entity?.ref}`,
        },
      ],
    },
  };
};