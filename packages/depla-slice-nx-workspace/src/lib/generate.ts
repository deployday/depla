import { resolve } from 'node:path';
import * as os from 'os';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = (workspace: any) => {
  console.log('RUNNING GENERATOR WITH FOLLOWING WORKPSACE', workspace);
  return {
    runBefore: [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes create-nx-workspace@15.7.2 ${workspace.name} \
            --preset=ts \
            --nxCloud=false --pm=npm`,
      // although this file doesn't have `generated` in it's path
      // (our internal convention to separate files that can be overwritten
      // from others)
      // we want to overwrite it every time so let's delete it first
      [`rm -f nx.json`, resolve(workspace.name)],
      [`rm -f .env`, resolve(workspace.name)],
      // [
      //   `sed -i '' '2s/^/"plugins": ["@sergeylukin\\/nxtensions-astro"],\n/' nx.json`,
      //   resolve(workspace.name),
      // ],
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
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i -D @nrwl/js@15.7.2 @nrwl/cypress@15.7.2`,
    ],
    runAfter: [''],
  };
};
