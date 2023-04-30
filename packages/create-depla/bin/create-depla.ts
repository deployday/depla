import * as fs from 'fs';
import { resolve } from 'node:path';
import * as os from 'os';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { execCommandAndStreamOutput } from 'depla';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import { printVerboseHook, rootDebug } from '../src/lib/debug.js';

const debug = rootDebug.extend('create-depla');
// const execCommandAndStreamOutput = async (something, cwd = '') => {
//   return new Promise((resolve, reject) => {
//     resolve('hooray' + something);
//   });
// };

const debugError = rootDebug.extend('create-depla:error');

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
      '[path]',
      'directory where application will be unpacked (`.` for current working directory)',
      ''
    )
    .option('--stack', 'what stack shall we use', 'depla-stack-nx-astro-unocss')
    .option('-y, --yes', 'do not ask any questions ', false)
    .option('-v, --verbose', 'output debug logs', false)
    // .option('--path <path>', 'the target name')
    // .requiredOption('--includeDirectories', 'copy directories')
    .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (path, options: OptionValues) => {
      let project = path;
      const { stack }: { stack?: string } = options;

      debug(`Parsing the file in....${project}`);
      debugError(`Ooops`, options);
      if (!project) {
        console.log(options);
        if (options['yes']) {
          project = defaults.project;
        } else {
          const projectRes = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Project name? (also relative path)',
            validate(value: string): string | boolean {
              return value ? true : `hmm...how shall we call the new project?`;
            },
          });
          project = projectRes.name;
        }
      }

      const projectPath = resolve(project as string);

      // Find depla.json

      console.log(
        `%s Creating project ${projectPath}`,
        chalk.yellow.bold('Hooray!')
      );
      // const cmds = createWorkspace({
      //   entities: [postSchema],
      //   name: project as string,
      // });
      const cmds = `npx ${stack} ${project}`;

      // const s = p.spinner();

      const hash = crypto.createHash('md5').update(stack).digest('hex');
      const workspace_dir = resolve(os.homedir() + '/.depla/workspaces/');
      const cache_dir = resolve(`${workspace_dir}/${hash}`);
      const ENABLE_CACHE = false;
      if (fs.existsSync(cache_dir) && ENABLE_CACHE) {
        await execCommandAndStreamOutput(
          `rm -fr ${projectPath} && cp -r ${cache_dir} ${projectPath}`
        );
      } else {
        // console.log(firstCommand, commands);
        // console.log(chalk.green.bold(firstCommand));
        // console.log(chalk.yellow.bold(commands));
        // const { stdout, stderr } = await $`${firstCommand}`;
        // const res = spawn(firstCommand)

        // s.start('Setting up');
        // Do installation
        const commands = cmds
          .split('&&')
          .map((cmd) => cmd.replace(/\\|\r?\n|\r/g, ' ').trim());
        console.log(commands);
        if (!fs.existsSync(projectPath)) {
          mkdirp.sync(resolve(projectPath));
        }

        // s.start('Setting up');
        // Do installation
        try {
          let cwd = '';
          for (let i = 0; i < commands.length; i++) {
            if (!cwd && fs.existsSync(projectPath)) cwd = projectPath;
            await execCommandAndStreamOutput(commands[i], cwd);
          }

          if (ENABLE_CACHE) {
            await execCommandAndStreamOutput(
              `rm -fr ${cache_dir} && cp -r ${projectPath} ${cache_dir}`
            );
          }
        } catch (e) {
          console.log('ERROR catched: ', e);
        }
      }

      // s.stop(chalk.green.bold('DONE'));
      console.log(chalk.green.bold('DONE'));
    });

  program.parse();

  // const options = program.opts();
  // const limit = options['first'] ? 1 : undefined;
  // const separator = options['separator'] as string;
  // if (program.args.length > 1) {
  //   // console.log(program.args[0].split(separator, limit));
  // } else {
  //   // console.log(program.args);
  // }

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
