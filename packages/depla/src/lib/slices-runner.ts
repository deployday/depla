import * as fs from 'fs';
import { resolve } from 'node:path';

import { execCommandAndStreamOutput } from '../index.js';

export const slicesRunner = async (config) => {
  const { workspaces } = config;
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = {
      name: 'default',
      baseDir: './',
      ...workspaces[i],
    };
    for (let y = 0; y < workspace.slices.length; i++) {
      await execCommandAndStreamOutput(workspace.slices[y]);
    }
  }
};
