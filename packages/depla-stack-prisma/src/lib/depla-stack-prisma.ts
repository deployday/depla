import * as path from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({ workspace }: { workspace: any }) => {
  const prismaInstallationPath = path.resolve('prisma/dev.db');
  const libraryExists = fs.existsSync(prismaInstallationPath);
  if (libraryExists)
    console.log(chalk.green(`prisma stack is already installed`));

  const ret = {
    runBefore: [
      ...(!libraryExists
        ? [
            `${VOLTA_BINARY} run --node ${NODE_VERSION} \
            npm i prisma@4.11.0 \
            @depla/utils-db@latest
            `,
          ]
        : []),
    ],
    runAfter: [
      ...(!libraryExists ? [`npx prisma migrate dev --name init`] : []),
      `npx prisma generate`,
    ],
    writingInjections: {
      providers: [
        {
          name: 'db',
          module: `@depla/utils-db`,
        },
      ],
    },
  };
  return ret;
};
