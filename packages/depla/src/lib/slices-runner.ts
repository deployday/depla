import * as os from 'os';
import { getWorkspaceByName, execCommandAndStreamOutput } from '../index.js';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const slicesRunner = async (config: any) => {
  const { workspaces } = config;
  console.log(workspaces);
  const commands = await Promise.all(
    workspaces.map(async (workspaceConfig) => {
      const workspace = getWorkspaceByName(workspaceConfig?.name, config);
      return await Promise.all(
        workspace.slices.map(async (slice) => {
          const slicePackage = typeof slice === 'object' ? slice.name : slice;
          const cmd = `${VOLTA_BINARY} run --node ${NODE_VERSION} npx --yes ${slicePackage} ${workspace.name}`;
          return await execCommandAndStreamOutput(cmd);
        })
      );
    })
  );
  return commands;
};
