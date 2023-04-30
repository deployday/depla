import * as os from 'os';
import { getWorkspaceByName, execCommandAndStreamOutput } from '../index.js';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const slicesRunner = async (config: any) => {
  const { workspaces } = config;
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = getWorkspaceByName(workspaces[i].name, config);
    for (let y = 0; y < workspace.slices.length; y++) {
      const slice = workspace.slices[y];
      const slicePackage = typeof slice === 'object' ? slice.name : slice;
      const cmd = `${VOLTA_BINARY} run --node ${NODE_VERSION} npx --yes ${slicePackage} ${workspace.name}`;
      console.log(cmd);
      await execCommandAndStreamOutput(cmd);
    }
  }
};
