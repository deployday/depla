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
import { generateStack } from '../src/index.js';
import {
  execCommandAndStreamOutput,
  entityFactory,
  IEntity,
  IGenerateStack,
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
  domain: ['post', 'comment'],
};

export const main = () => {
  program
    .argument('[entities]', 'domain entities', defaults.domain.join(', '))
    .option('-y, --yes', 'do not ask any questions ', false)
    .option('-v, --verbose', 'output debug logs', false)
    // .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (entities: string, options: OptionValues) => {
      const domain: IEntity[] = entities
        .split(',')
        .map((entity) => entityFactory(entity.trim()));
      const { commands, zip }: IGenerateStack = await generateStack(
        [
          {
            name: 'asda',
            generator: () => {
              return 'foo';
            },
          },
          {
            name: 'asda',
            generator: () => {
              return 'zombie';
            },
          },
        ],
        domain,
        { scope: 'asd', name: 'asd' }
      );
      try {
        console.log(
          chalk.yellow('AND HERE are the commands to run:'),
          commands
        );
        console.log('========');
        console.log(chalk.green('AND HERE is contents of zip'));
        zip.forEach(async (relativePath, file) => {
          console.log(file.name);
          const fileObj = zip.file(file.name);
          const isFile = fileObj;
          if (isFile) {
            const contents = await fileObj.async('string');
            console.log(contents);
          }
          // console.log(contents);
        });

        console.log('========');
        for (let i = 0; i < commands.length; i++) {
          await execCommandAndStreamOutput(commands[i]);
        }
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
