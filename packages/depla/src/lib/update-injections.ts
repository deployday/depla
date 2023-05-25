import path from 'node:path';
import fs from 'node:fs';
import merge from 'lodash.merge';
import { readFile } from 'fs/promises';
import mkdirp from 'mkdirp';
import exp from 'node:constants';
import { IInjection, IExpectedInjection, IContext } from 'depla';

export const updateInjections = async (
  {
    writingInjections = {},
    expectingInjections = [],
  }: {
    writingInjections?: any;
    expectingInjections?: IExpectedInjection[];
  },
  context: IContext
) => {
  const { workspace, app } = context;
  const shouldUpdateAllApps = !app;
  const deplaDir = path.resolve('.depla');
  const injectionsJSONPath = path.resolve('./.depla', 'injections.json');
  if (!fs.existsSync(injectionsJSONPath)) {
    mkdirp.sync(deplaDir);
  }
  let config = fs.existsSync(injectionsJSONPath)
    ? JSON.parse((await readFile(injectionsJSONPath)).toString())
    : {};

  const appName = app?.name;
  const appsToUpdate = workspace.apps
    .filter((app) => shouldUpdateAllApps || app.name === appName)
    .map((app) => app.name);
  console.log(
    'GOT TO THE UPDATE PHASE with following context',
    context,
    ' APPS: ',
    appsToUpdate,
    ' SHOULD ALL: ',
    shouldUpdateAllApps
  );
  const workspaceObj = appsToUpdate.reduce((acc, appName) => {
    console.log('INSIDE REDUCE ', acc, appName, writingInjections);
    acc[appName] = {};
    for (let [injectionName, injections = []] of Object.entries(
      writingInjections
    )) {
      const arr =
        config.writingInjections?.[workspace.name]?.[appName]?.[
          injectionName
        ] || [];
      acc[appName][injectionName] = Object.values(
        [...arr, ...(injections as any[])].reduce((a, c) => {
          a[c.name + '|' + c.module] = c;
          return a;
        }, {})
      );
    }
    return acc;
  }, {});
  console.log('TADADAADADAADAD', workspaceObj);
  config = merge(config, {
    writingInjections: {
      [workspace.name]: workspaceObj,
    },
  });
  console.log('WOWOWOWOWWOWO', JSON.stringify(workspaceObj, null, 2));

  // for (let [injectionName, injections] of Object.entries(writingInjections)) {
  //   const arr =
  //     config.writingInjections[workspace.name][appName][injectionName] || [];
  //   config.writingInjections[workspace.name][appName][injectionName] =
  //     Object.values(
  //       [...arr, ...injections].reduce((a, c) => {
  //         a[c.name + '|' + c.module] = c;
  //         return a;
  //       }, {})
  //     );
  // }

  config.expectingInjections = {
    ...(config.expectingInjections || {}),
    ...expectingInjections.reduce((prev, curr) => {
      const id = `${curr.filename}-${curr.injectionName}`;
      prev[id] = curr;
      return prev;
    }, {}),
  };

  fs.writeFileSync(injectionsJSONPath, JSON.stringify(config, null, 2));
};
