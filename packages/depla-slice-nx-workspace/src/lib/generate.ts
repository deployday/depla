import { resolve } from 'node:path';
import * as os from 'os';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = (workspace: any) => {
  console.log('RUNNING GENERATOR WITH FOLLOWING WORKPSACE', workspace);
  return {
    runBefore: [
      [
        `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes create-nx-workspace@latest ${workspace.name} \
            --preset=empty \
            --nxCloud=false --pm=npm`,
      ],
      [`${VOLTA_BINARY} pin node@${NODE_VERSION}`, resolve(workspace.name)],
      [
        // ;; is replaced with ;, see exec.ts from `depla` package
        `find ${resolve(workspace.name)} -maxdepth 1 -exec mv {} ${resolve(
          workspace.name,
          '../',
          workspace.baseDir
        )}  ;;`,
      ],
      [`rm -fr ${resolve(workspace.name)}`],
    ],
    runAfter: [''],
  };
};
