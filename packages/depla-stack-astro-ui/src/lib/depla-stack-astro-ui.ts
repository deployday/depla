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
}: {
  domain: any;
  workspace: any;
  app: any;
}) => {
  const uiDirectoryPath = path.join(process.cwd(), `libs/shared/ui`);
  const uiGeneratedDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/generated/ui`
  );
  const libraryExists = fs.existsSync(uiDirectoryPath);
  if (libraryExists) console.log(chalk.green(`ui is already installed`));

  return {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
          npm i \
            @depla/utils-time@latest \
            hast-util-sanitize@^4.1.0 \
            hast-util-to-jsx-runtime@^1.2.0
        `,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ui --directory=shared --importPath=${workspace.scope}/shared/ui \
         --unitTestRunner=none`,
          `rm -fr ${uiDirectoryPath}/src`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ui --directory=shared/generated --importPath=${workspace.scope}/shared/generated/ui \
         --unitTestRunner=none`,
          `rm -fr ${uiGeneratedDirectoryPath}/src`,
        ]
      : [],
    runAfter: [],
    writingInjections: {},
  };
};
