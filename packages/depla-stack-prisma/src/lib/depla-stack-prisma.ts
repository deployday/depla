import * as path from 'node:path';
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
  const prismaDirectoryPath = path.resolve('prisma');
  const sharedPrismaDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/prisma`
  );
  const libraryExists = fs.existsSync(prismaDirectoryPath);
  if (libraryExists)
    console.log(chalk.green(`prisma stack is already installed`));

  const ret = {
    runBefore: [
      // although this file doesn't have `generated` in it's path
      // (our internal convention to separate files that can be overwritten
      // from others)
      // we want to overwrite it every time so let's delete it first
      `rm -f ${prismaDirectoryPath}/schema.prisma`,
      ...(!libraryExists
        ? [
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i prisma@4.11.0`,

            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i -D zod-prisma-types@2.7.1`,

            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @depla/utils-db@latest`,

            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes prisma init --datasource-provider sqlite`,

            `cp domain.prisma ${prismaDirectoryPath}/schema.prisma`,
          ]
        : []),
    ],
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
