import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import * as os from 'os';
import { fileURLToPath } from 'node:url';
import inquirer from 'inquirer';
import JSZip from 'jszip';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import * as crypto from 'crypto';
import mkdirp from 'mkdirp';
import { generate } from '../src/index.js';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import {
  execBulk,
  entityFactory,
  IEntity,
  generateSliceForAllEntities,
  IGenerateStack,
  extractArchive,
} from 'depla';
// import { printVerboseHook, rootDebug } from '../src/utils.js';
// import { postSchema } from '../src/entities.js';
// import { createWorkspace } from '../src/create-workspace.js';

// const debug = rootDebug.extend('doSomething');
//
// const debugError = rootDebug.extend('doSomething:error');

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

const defaults: {
  domain: string[];
} = {
  domain: ['user', 'page'],
};

export const main = () => {
  program
    .argument('[path]', 'where to unpack', defaults.domain.join(', '))
    .option('-e, --entities', 'domain entities', defaults.domain.join(', '))
    .option('-y, --yes', 'do not ask any questions ', false)
    .option('-v, --verbose', 'output debug logs', false)
    // .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (projectPath: string, options: OptionValues) => {
      const entities: string = options.entities as string;
      const domain: IEntity[] = entities
        .split(',')
        .concat(['post', 'tag'])
        .map((entity) => entityFactory(entity.trim()));

      const context = {
        name: projectPath,
        entities: domain,
      };

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templatesPath = path.resolve(__dirname, `../files`);
      const { runBefore, runAfter, zip }: IGenerateStack =
        await generateSliceForAllEntities(generate, {
          domain,
          templatesPath,
          context,
        });

      try {
        execBulk(runBefore);
        extractArchive(zip, context);
        execBulk(runAfter);
      } catch (e) {
        console.log('ERROR catched: ', e);
      }
      // let project = projectName;
      // debug(`Parsing the project....${project}`);
      // if (!project) {
      //   if (options['yes']) {
      //     project = defaults.project;
      //   } else {
      //     const projectRes = await inquirer.prompt({
      //       type: 'input',
      //       name: 'name',
      //       message: 'Project name?',
      //       validate(value: string): string | boolean {
      //         return value ? true : `please provide project name`;
      //       },
      //     });
      //     project = projectRes.name;
      //   }
      // }
      //
      // const projectPath = projectPath.resolve(project as string);
      // console.log(
      //   `%s Creating project ${projectPath}`,
      //   chalk.yellow.bold('Hooray!')
      // );
      // const cmds = createWorkspace({
      //   entities: [postSchema],
      //   name: project as string,
      // });
      //
      // const hash = crypto.createHash('md5').update(cmds).digest('hex');
      // const workspace_dir = projectPath.resolve(os.homedir() + '/.depla/workspaces/');
      // const cache_dir = projectPath.resolve(`${workspace_dir}/${hash}`);
      // const project_dir = projectPath.resolve(project as string);
      // if (existsSync(cache_dir) && false) {
      //   await execCommandAndStreamOutput(
      //     `rm -fr ${project_dir} && cp -r ${cache_dir} ${project_dir}`
      //   );
      // } else {
      //   const firstCommand = cmds.split('&& \\')[0].split('\\\n').join('');
      //   const commands = cmds
      //     .split('&& \\')
      //     .slice(1)
      //     .map((cmd) => cmd.replace(/\r?\n|\r/g, ' ').trim());
      //   console.log(firstCommand, commands);
      //   try {
      //     await execCommandAndStreamOutput(firstCommand);
      //
      //     console.log(commands);
      //     for (let i = 0; i < commands.length; i++) {
      //
      //       await execCommandAndStreamOutput(commands[i], projectPath);
      //     }
      //
      //     await execCommandAndStreamOutput(
      //       `rm -fr ${cache_dir} && cp -r ${project_dir} ${cache_dir}`
      //     );
      //   } catch (e) {
      //     console.log('ERROR catched: ', e);
      //   }
      // }
      //
      // console.log(chalk.green.bold('DONE'));
      //
      // debug(`Parsing the file....`);
    });

  program.parse();
};
