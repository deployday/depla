import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import * as os from 'os';
import fs from 'fs';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { generate } from '../src/index.js';
import { execBulk, getWorkspaceByName } from 'depla';
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
      const config = JSON.parse(
        (await readFile(resolve('depla.json'))).toString()
      );
      const workspace = getWorkspaceByName(workspaceName as string, config);
      if (fs.existsSync(resolve(workspace.baseDir, 'nx.json'))) {
        console.log(
          chalk.green(
            `Workspace ${workspaceName} is already installed. Moving on...`
          )
        );
        return Promise.resolve();
      }
      const { runBefore } = await generate(workspace);
      execBulk(runBefore);
    });

  program.parse();
};
