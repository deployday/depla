import * as fs from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import * as os from 'os';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import {
  postSchema,
  createWorkspace,
  execCommandAndStreamOutput,
  slicesRunner,
} from '../src/index.js';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import { printVerboseHook, rootDebug } from '../src/lib/debug.js';

const debug = rootDebug.extend('depla');
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
      '.'
    )
    .option('--stack', 'what stack shall we use', 'depla-stack-nx-astro-unocss')
    .option('-y, --yes', 'do not ask any questions ', false)
    .option('-v, --verbose', 'output debug logs', false)
    // .option('--path <path>', 'the target name')
    // .requiredOption('--includeDirectories', 'copy directories')
    .hook('preAction', printVerboseHook)
    // @ts-ignore
    .action(async (path, options: OptionValues) => {
      const config = JSON.parse(
        (await readFile(resolve(path as string, 'depla.json'))).toString()
      );
      slicesRunner(config);
      // const config = fs.readFileSync(resolve('./depla.json'));
      // console.log('OPPPPPAAA', JSON.parse(config.toString()));
    });

  program.parse();
};
