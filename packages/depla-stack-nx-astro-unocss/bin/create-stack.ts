import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
// import { execCommandAndStreamOutput } from '../src/exec.js';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import { createDepla } from 'create-depla';
import { generate } from '../src/index.js';
import { create } from 'domain';
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
  project: string;
} = {
  project: 'happy-strawberry-in-icecream',
};

export const main = () => {
  program
    .argument(
      '[project-name]',
      'directory where application will be unpacked',
      ''
    )
    .option('-y, --yes', 'do not ask any questions ', false)
    .option('-v, --verbose', 'output debug logs', false)
    // .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (projectName, options: OptionValues) => {
      console.log(
        chalk.blue('HEEEY WORKING'),
        chalk.green(generate()),
        projectName
      );
      console.log(
        chalk.yellow('AND HERE IS import from create-depla'),
        createDepla()
      );
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
      // const projectPath = path.resolve(project as string);
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
      // const workspace_dir = path.resolve(os.homedir() + '/.depla/workspaces/');
      // const cache_dir = path.resolve(`${workspace_dir}/${hash}`);
      // const project_dir = path.resolve(project as string);
      // if (fs.existsSync(cache_dir) && false) {
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
