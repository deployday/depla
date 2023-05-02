import path from 'node:path';
import fs from 'node:fs';
import { readFile } from 'fs/promises';
import mkdirp from 'mkdirp';
import exp from 'node:constants';
import { IInjection, IExpectedInjection, IContext } from 'depla';

export const updateInjections = async (
  {
    writingInjections = [],
    expectingInjections = [],
  }: {
    writingInjections?: any[];
    expectingInjections?: IExpectedInjection[];
  },
  context: IContext
) => {
  const { workspace, app } = context;
  const deplaDir = path.resolve('.depla');
  const injectionsJSONPath = path.resolve('./.depla', 'injections.json');
  if (!fs.existsSync(injectionsJSONPath)) {
    mkdirp.sync(deplaDir);
  }
  let config = fs.existsSync(injectionsJSONPath)
    ? JSON.parse((await readFile(injectionsJSONPath)).toString())
    : {};

  config = {
    ...config,
    ...{
      writingInjections: {
        [workspace.name]: {
          [app.name]:
            config?.writingInjections?.[workspace.name]?.[app.name] || {},
        },
      },
    },
  };

  for (let [injectionName, injections] of Object.entries(writingInjections)) {
    const arr =
      config.writingInjections[workspace.name][app.name][injectionName] || [];
    config.writingInjections[workspace.name][app.name][injectionName] = [
      ...arr,
      ...injections,
    ];
  }

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
