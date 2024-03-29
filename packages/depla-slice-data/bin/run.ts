import { readFile } from 'fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as os from 'os';
import fs from 'node:fs';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { generate } from '../src/index.js';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';

import {
  execBulk,
  IEntity,
  entityFactory,
  extractArchive,
  getWorkspaceByName,
  getAppByName,
  generateSliceForAllEntities,
  IGenerateStack,
} from 'depla';

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

export const main = () => {
  program
    .argument('[app]', 'what app shall we use', 'website')
    .argument('[workspace]', 'what workspace shall we use', '')
    // .argument('-w, --workspace', 'what workspace shall we use', 'acme')
    // @ts-ignore
    .action(async (appName, workspaceName) => {
      const config = JSON.parse(
        (await readFile(path.resolve('depla.json'))).toString()
      );
      console.log('YYYYYY', config);
      const workspace = getWorkspaceByName(
        workspaceName as string,
        config.workspaces
      );
      const app = getAppByName(appName as string, workspace.apps);
      const context = { workspace, app };

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templatesPath = path.resolve(__dirname, `../files`);
      const { runBefore, runAfter, zip }: IGenerateStack =
        await generateSliceForAllEntities(generate, {
          templatesPath,
          context,
        });

      try {
        await execBulk(runBefore);
        await extractArchive(zip, context);
        await execBulk(runAfter);
      } catch (e) {
        console.log('ERROR catched: ', e);
      }
    });

  program.parse();
};
