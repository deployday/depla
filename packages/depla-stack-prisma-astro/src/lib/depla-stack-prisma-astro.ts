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
  const entityGeneratedDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/generated/entities/${entity?.ref}`
  );
  const libraryExists = fs.existsSync(entityDirectoryPath);
  if (libraryExists)
    console.log(chalk.green(`entity  ${entity?.model} is already installed`));

  return {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
          npm i \
        prismock@1.13.1 \
        @depla/utils-js-object@latest \
        @depla/utils-url@latest
        `,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.ref} --directory=shared/entities --importPath=${workspace.scope}/shared/entities/${entity?.ref} \
         --unitTestRunner=none`,
          `rm -fr ${entityDirectoryPath}/src`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ${entity?.ref} --directory=shared/generated/entities --importPath=${workspace.scope}/shared/generated/entities/${entity?.ref} \
         --unitTestRunner=none`,
          `rm -fr ${entityGeneratedDirectoryPath}/src`,
        ]
      : [],
    runAfter: [
      ...(!libraryExists
        ? [
            // `:./dev.db' nx setup-prisma ${app.name}`,
            // `npx prisma migrate dev --name init`,
            `git add .`,
            `git commit --author="Dep La <la@depl.la>" -m "infra: depla initial commit"`,
          ]
        : []),
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
