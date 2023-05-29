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
  transferBlobs,
  IEntity,
  entityFactory,
  updateInjections,
  getAppByName,
  getWorkspaceByName,
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
      const domain: IEntity[] = config.entities.map((entity: string) =>
        entityFactory(entity.trim())
      );
      const context = { workspace, app, domain };

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templatesPath = path.resolve(__dirname, `../files`);
      const {
        runBefore,
        runAfter,
        zip,
        blobs,
        expectingInjections,
      }: IGenerateStack = await generateSliceForAllEntities(generate, {
        templatesPath,
        context,
      });

      console.log('BLLLLLLOOOOBS', blobs);
      try {
        await execBulk(runBefore);
        await extractArchive(zip, context);
        await transferBlobs(blobs, process.cwd());
        await updateInjections(
          {
            expectingInjections,
          },
          context
        );
        await execBulk(runAfter);
      } catch (e) {
        console.log('ERROR catched: ', e);
        console.log('ZIPPPP', zip);
      }
    });

  program.parse();
};
