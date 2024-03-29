import { readFile } from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as os from 'os';
import * as process from 'process';
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
  extractArchive,
  updateInjections,
  IEntity,
  entityFactory,
  getAppByName,
  getWorkspaceByName,
  generateSlice,
  IGenerateStack,
} from 'depla';

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

export const main = () => {
  program
    .argument('[app]', 'what app shall we use', '')
    .argument('[workspace]', 'what workspace shall we use', '')
    // @ts-ignore
    .action(async (appName, workspaceName) => {
      const config = JSON.parse(
        (await readFile(path.resolve('depla.json'))).toString()
      );
      const currentDirectoryName = path.resolve('./').split(path.sep).pop();
      const workspace = getWorkspaceByName(
        (workspaceName as string) || (currentDirectoryName as string),
        config.workspaces
      );
      const app = getAppByName(appName as string, workspace.apps);
      const domainJSON = JSON.parse(
        (await readFile(path.resolve('.depla/domain.json'))).toString()
      );
      const domain: IEntity[] = domainJSON.entities;
      const context = { workspace, app, domain };

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templatesPath = path.resolve(__dirname, `../files`);
      const { runBefore, runAfter, zip, writingInjections }: IGenerateStack =
        await generateSlice(generate, {
          templatesPath,
          context,
        });

      await updateInjections(
        {
          writingInjections,
        },
        context
      );

      console.log('OK WE ARE AFTER THAT HERE IS RUNBEFORE', runBefore);

      try {
        await execBulk(runBefore);
        await extractArchive(zip, context);
        await execBulk(runAfter);
      } catch (e) {
        console.log('ERROR catched: ', e);
        console.log('ZIPPPP', zip);
      }
    });

  program.parse();
};
