import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as process from 'process';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { execCommandAndStreamOutput } from '../src/exec.js';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import { printVerboseHook, rootDebug } from '../src/utils.js';
import { postSchema } from '../src/entities.js';
import { createWorkspace } from '../src/create-workspace.js';

const debug = rootDebug.extend('doSomething');

const debugError = rootDebug.extend('doSomething:error');

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
    // .option('--path <path>', 'the target name')
    // .requiredOption('--includeDirectories', 'copy directories')
    .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (projectName, options: OptionValues) => {
      let project = projectName;
      if (!project) {
        if (options['yes']) {
          project = defaults.project;
        } else {
          const projectRes = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Project name?',
            validate(value: string): string | boolean {
              return value ? true : `please provide project name`;
            },
          });
          project = projectRes.name;
          // project = await p.text({
          //   message: 'Project name?',
          //   placeholder: defaults.project,
          //   initialValue: defaults.project,
          //   validate(value: string): string {
          //     return String(!value) ?? `Project name is required!`;
          //   },
          // });
        }
      }

      const projectPath = path.resolve(project as string);
      console.log(
        `%s Creating project ${projectPath}`,
        chalk.yellow.bold('Hooray!')
      );
      const cmds = createWorkspace({
        entities: [postSchema],
        name: project as string,
      });

      // const s = p.spinner();

      const hash = crypto.createHash('md5').update(cmds).digest('hex');
      const workspace_dir = path.resolve(os.homedir() + '/.depla/workspaces/');
      const cache_dir = path.resolve(`${workspace_dir}/${hash}`);
      // return `echo Hello && \\\n`;
      const project_dir = path.resolve(project as string);
      if (fs.existsSync(cache_dir) && false) {
        await execCommandAndStreamOutput(
          `rm -fr ${project_dir} && cp -r ${cache_dir} ${project_dir}`
        );
      } else {
        const firstCommand = cmds.split('&& \\')[0].split('\\\n').join('');
        const commands = cmds
          .split('&& \\')
          .slice(1)
          .map((cmd) => cmd.replace(/\r?\n|\r/g, ' ').trim());
        console.log(firstCommand, commands);
        // console.log(chalk.green.bold(firstCommand));
        // console.log(chalk.yellow.bold(commands));
        // const { stdout, stderr } = await $`${firstCommand}`;
        // const res = spawn(firstCommand)

        // s.start('Setting up');
        // Do installation
        try {
          await execCommandAndStreamOutput(firstCommand);

          console.log(commands);
          for (let i = 0; i < commands.length; i++) {
            await execCommandAndStreamOutput(commands[i], projectPath);
          }

          await execCommandAndStreamOutput(
            `rm -fr ${cache_dir} && cp -r ${project_dir} ${cache_dir}`
          );
        } catch (e) {
          console.log('ERROR catched: ', e);
        }
      }

      // s.stop(chalk.green.bold('DONE'));
      console.log(chalk.green.bold('DONE'));

      debug(`Parsing the file....`);
    });

  program.parse();

  const options = program.opts();
  const limit = options['first'] ? 1 : undefined;
  const separator = options['separator'] as string;
  if (program.args.length > 1) {
    // console.log(program.args[0].split(separator, limit));
  } else {
    // console.log(program.args);
  }

  // const group = await p.group(
  //   {
  //     name: () => p.text({ message: 'What is your name?' }),
  //     age: () => p.text({ message: 'What is your age?' }),
  //     color: ({ results }) =>
  //       p.multiselect({
  //         message: `What is your favorite color ${results.name}?`,
  //         options: [
  //           { value: 'red', label: 'Red' },
  //           { value: 'green', label: 'Green' },
  //           { value: 'blue', label: 'Blue' },
  //         ],
  //       }),
  //   },
  //   {
  //     // On Cancel callback that wraps the group
  //     // So if the user cancels one of the prompts in the group this function will be called
  //     onCancel: ({ results }) => {
  //       p.cancel('Operation cancelled.');
  //       process.exit(0);
  //     },
  //   }
  // );

  // const s = spinner();
  // const doSomething = async () => {
  //   return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
  // };
  // s.start('Installing via npm');
  // // Do installation
  // await doSomething();
  // s.stop('Installed via npm');
  // const additionalTools = await multiselect({
  //   message: 'Select additional tools.',
  //   options: [
  //     { value: 'eslint', label: 'Server side functions', hint: 'recommended' },
  //     { value: 'prettier', label: 'Database' },
  //   ],
  //   required: false,
  // });
  //
  // const meaning = await text({
  //   message: 'What is the meaning of life?',
  //   placeholder: 'Not sure',
  //   initialValue: '42',
  //   validate(value) {
  //     if (value.length === 0) return `Value is required!`;
  //   },
  // });
  //
  // if (isCancel(meaning)) {
  //   cancel('Operation cancelled.');
  //   process.exit(0);
  // }
  //
  // const shouldContinue = await confirm({
  //   message: 'Do you want to continue?',
  // });

  // console.log(group.name, group.age, group.color);
};
