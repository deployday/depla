import { readFile } from 'fs/promises';
import * as os from 'os';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import {
  getAppByName,
  getWorkspaceByName,
  execCommandAndStreamOutput,
  IExpectedInjection,
} from '../index.js';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const slicesRunner = async (config: any) => {
  const { workspaces } = config;
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = getWorkspaceByName(workspaces[i].name, config.workspaces);
    for (let y = 0; y < workspace.slices.length; y++) {
      const slice = workspace.slices[y];
      const slicePackage = typeof slice === 'object' ? slice.name : slice;
      const cmd = `${VOLTA_BINARY} run --node ${NODE_VERSION} npx --yes ${slicePackage} ${workspace.name}`;
      console.log(cmd);
      await execCommandAndStreamOutput(cmd);
    }
    for (let y = 0; y < workspace.apps.length; y++) {
      const app = workspace.apps[y];
      for (let z = 0; z < app.slices.length; z++) {
        const slice = app.slices[z];
        const slicePackage = typeof slice === 'object' ? slice.name : slice;
        const cmd = `${VOLTA_BINARY} run --node ${NODE_VERSION} npx --yes ${slicePackage} ${app.name} ${workspace.name}`;
        console.log(cmd);
        await execCommandAndStreamOutput(cmd);
      }
    }
  }

  // do injects
  const injectionsJSONPath = path.resolve('./.depla', 'injections.json');
  const injectionsJSON = fs.existsSync(injectionsJSONPath)
    ? JSON.parse((await readFile(injectionsJSONPath)).toString())
    : {};
  const deplaJSON = JSON.parse(
    (await readFile(path.resolve('depla.json'))).toString()
  );
  let key: string;
  let val: IExpectedInjection;
  for (const smth of Object.entries(injectionsJSON.expectingInjections)) {
    // @ts-ignore
    val = smth[1];
    console.log('HERE', val);
    const workspaceO = getWorkspaceByName(
      val.workspaceName,
      deplaJSON.workspaces
    );
    const app = getAppByName(val.appName, workspaceO.apps);
    const injectionName = val.injectionName;
    const context = {
      workspace: workspaceO,
      app,
      injects: injectionsJSON.writingInjections[val.workspaceName][val.appName],
    };
    console.log('POOOOOOOO', context);
    const rendered = ejs.render(val.contents, context);
    fs.writeFileSync(path.resolve(`./${val.filename}`), rendered);
    console.log(rendered);
  }
};
