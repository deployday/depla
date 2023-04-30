import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import * as os from 'os';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { generate } from '../src/index.js';
import { execCommandAndStreamOutput, getWorkspaceByName } from 'depla';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

export const main = () => {
  program
    .argument('[workspace]', 'what workspace shall we use', 'acme')
    // .argument('-w, --workspace', 'what workspace shall we use', 'acme')
    // @ts-ignore
    .action(async (workspaceName) => {
      // @ts-ignore
      // const { workspace: workspaceName } = options;
      // console.log('asdaASDASD', options);
      const config = JSON.parse(
        (await readFile(resolve('depla.json'))).toString()
      );
      console.log('YYYYYY', config);
      const workspace = getWorkspaceByName(workspaceName as string, config);
      const { runBefore } = await generate(workspace);
      console.log(runBefore);
      const defaultCWD = resolve('./');
      let cwd, cmd;
      for (let i = 0; i < runBefore.length; i++) {
        try {
          cmd = runBefore[i][0];
          if (runBefore[i][1]) {
            cwd = runBefore[i][1];
          } else {
            cwd = defaultCWD;
          }
          cmd = cmd.replace(/\\|\r?\n|\r/g, ' ').trim();
          await execCommandAndStreamOutput(cmd, cwd);
        } catch (e) {
          console.log('CATCHED', e);
        }
      }
    });

  program.parse();
};
