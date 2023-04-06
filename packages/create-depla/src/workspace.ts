import { Config, IEntity, Command } from './types.js';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';
import {
  DATA_MODULE,
  STATE_MODULE,
  MATERIAL_MODULE,
  LOGIN_MODULE,
} from './modules.js';
import mkdirp from 'mkdirp';

const NODE_VERSION = '16.16.0';
const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;

// THE KITCHEN
const volta = ({ config }: { config: Config }) => {
  const output = `curl https://get.volta.sh -o /tmp/volta \
    && chmod +x /tmp/volta \
    && /tmp/volta --skip-setup`;
  return `${output} && \\`;
};

const workspace = ({ config }: { config: Config }) => {
  const workspaced_dir = path.resolve(os.homedir() + '/.depla/workspaces/');
  mkdirp.sync(workspaced_dir);
  // const output = `${VOLTA_BINARY} help`;
  const output = `${VOLTA_BINARY} run --node ${NODE_VERSION} \
  npx --yes create-nx-workspace@latest ${config.name} \
  --preset=empty \
  --nxCloud=false --pm=npm`;
  const hash = crypto.createHash('md5').update(output).digest('hex');
  const cache_dir = path.resolve(`${workspaced_dir}/${hash}`);
  // return `echo Hello && \\\n`;
  const project_dir = path.resolve(config.name);
  if (fs.existsSync(cache_dir)) {
    if (fs.existsSync(project_dir)) {
      return `rm -fr ${project_dir} && cp -r ${cache_dir} ${project_dir} && \\\n`;
    } else {
      return `cp -r ${cache_dir} ${project_dir} && \\\n`;
    }
  } else {
    return `${output} && cd ${project_dir}; ${VOLTA_BINARY} pin node@${NODE_VERSION}; cp -r ${project_dir} ${cache_dir} && \\\n`;
  }
  //   const output = `npx --yes create-nx-workspace@latest ${config.name} \\
  //   --appName=${config.application} \\
  //   --preset=${config.type} \\
  //   --npmScope=${config.scope} \\
  //   --nx-cloud=false \\
  //   --linter=eslint \\
  //   --style=scss && \\
  // cd ${config.name}/ && \\\n`;
};

const packages = ({ config }: { config: Config }) => {
  const project_dir = path.resolve(config.name);
  return config?.packages?.reduce((code, dependency) => {
    const { packageName, isDev } = dependency;
    const flag = isDev ? '-D' : '';
    return (code += `npm i ${flag} ${packageName} && \\\n`);
  }, '');
};

const apps = ({ config }: { config: Config }) => {
  const project_dir = path.resolve(config.name);
  return config?.apps?.reduce((code, app) => {
    return (code += `npx --yes nx g ${app.generatorName}:app ${app.appName} ${
      app.flags || ''
    } && \\\n`);
  }, '');
};

const fonts = ({ config }: { config: Config }) =>
  config?.fonts?.reduce((code, font) => {
    return (code += `npm i -D @fontsource/${font} && \\\n`);
  }, '');

const deplaJson = ({ config }: { config: Config }) => {
  const deplaJson = config.libs.reduce(
    (prev, curr) => {
      const { name, directory } = curr;
      if (directory.indexOf('entities') !== -1) {
        if (prev.entities.indexOf(name) === -1) prev.entities.push(name);
      }
      prev.libs.push(`${directory}/${name}`);
      return prev;
    },
    { libs: [], entities: [] }
  );
  return `echo ${JSON.stringify(deplaJson, null, 2)} > depla.json && \\\n`;
  // return `echo HELLO | sed s/'/\\\\\'/g > depla.json && \\\n`;
};

const libs = ({ config }: { config: Config }) => {
  const project_dir = path.resolve(config.name);
  return config?.libs?.reduce((code, lib) => {
    return (code += `nx g ${lib.generatorName} ${lib.name} --directory=${
      lib.directory
    } ${lib.flags || ''} && \\\n`);
  }, '');
};

const integrations = ({
  config,
  suffix = '',
}: {
  config: Config;
  suffix: string;
}) => {
  const project_dir = path.resolve(config.name);
  return config?.integrations?.reduce((code, lib) => {
    const { integrationName, afterCmd } = lib;
    return (code += `npx --yes astro add ${integrationName} -y ${afterCmd} && \\\n`);
  }, '');
};

const slice = ({ config, module }: { config: Config; module: string }) =>
  config?.entities?.reduce((code, entity) => {
    return (code += `nx g slice ${entity.modelPlural} \\
    --project ${module} \\
    --directory ${entity.modelPlural} \\
    --no-interactive \\
    --facade && \\\n`);
  }, '');

const state = ({ config, module }: { config: Config; module: string }) =>
  config?.entities?.reduce((code, entity) => {
    return (code += `nx g @nrwl/angular:ngrx ${entity.modelPlural} \\
    --module=libs/${module}/src/lib/${module}.module.ts \\
    --directory ${entity.modelPlural} \\
    --no-interactive \\
    --facade && \\\n`);
  }, '');

const services = ({ config, module }: { config: Config; module: string }) =>
  config?.entities?.reduce((code, entity) => {
    return (code += `nx g s services/${entity.modelPlural}/${entity.modelPlural} --project=${module} && \\\n`);
  }, '');

const containerComponent = ({
  entity,
  suffix = '',
}: {
  entity: IEntity;
  suffix: string;
}) => `nx g c ${entity.modelPlural} ${suffix} && \\\n`;

const listComponent = ({
  entity,
  suffix = '',
}: {
  entity: IEntity;
  suffix: string;
}) =>
  `nx g c ${entity.modelPlural}-list --directory=${entity.modelPlural}${suffix} && \\\n`;

const detailsComponent = ({
  entity,
  suffix = '',
}: {
  entity: IEntity;
  suffix: string;
}) =>
  `nx g c ${entity.model}-details  --directory=${entity.modelPlural} ${suffix} && \\\n`;

const libComponent = ({
  entity,
  project,
  suffix = '',
}: {
  entity: IEntity;
  project: string;
  suffix: string;
}) => `nx g c ${entity.model} --project ${project} ${suffix} && \\\n`;

const componentLayer = ({
  config,
  suffix = '',
}: {
  config: Config;
  suffix: string;
}) =>
  config?.entities?.reduce((code, entity) => {
    code += containerComponent({ entity, suffix });
    code += listComponent({ entity, suffix });
    code += detailsComponent({ entity, suffix });
    return code;
  }, '');

const nest = ({ config }: { config: Config }) =>
  config?.entities?.reduce((code, entity) => {
    return (code += `nx g @nestjs/schematics:resource ${entity.modelPlural} \\
    --project api \\
    --no-interactive && \\\n`);
  }, '');

const routingModule = () =>
  `nx g m routing --flat=true -m=app.module.ts && \\\n`;

const stateContainer = () => `touch libs/core-state/src/lib/index.ts && \\\n`;

const jsonServer = () => `mkdir server && touch server/db.json && \\\n`;

// const start = () => `npx --yes concurrently "npm start" "npm start api"`;

const generate = (commands: Command[]) =>
  commands.reduce((code, command) => {
    code += command.func(command.params);
    return code;
  }, '');

const suffixes = {
  style: `--style=scss`,
  lib: `--component=false`,
  component: ` --export=false --routing=true --style=scss`,
};

export const generateWorkspace = (config: Config) => {
  mkdirp.sync(path.resolve(os.homedir() + '/.depla'));
  const commands = [
    { func: volta, params: { config } },
    { func: workspace, params: { config } },
    // { func: packages, params: { config } },
    // { func: apps, params: { config } },
    // { func: integrations, params: { config } },
    // { func: libs, params: { config } },
    // { func: fonts, params: { config } },
    // { func: deplaJson, params: { config } },
    // { func: slice, params: { config, module: STATE_MODULE } },
    // { func: componentLayer, params: { config, suffix: suffixes.component } },
    // {
    //   func: containerComponent,
    //   params: {
    //     entity: config?.detached?.['home'],
    //     suffix: suffixes.component,
    //   },
    // },
    // { func: jsonServer, params: {} },
    // { func: start, params: {} },
  ];
  return generate(commands);
};
