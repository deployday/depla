import { readFile } from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fs from 'fs';
import * as process from 'process';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import chalk from 'chalk';
import {
  Command,
  OptionValues,
  CommandUnknownOpts,
} from '@commander-js/extra-typings';
import { parse } from '@astrojs/compiler';

import { convertAst } from '../src/index.js';

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

export const main = () => {
  program
    .argument(
      '[filePath]',
      'what ASTRO file shall we convert to REKA',
      path.resolve('~/code/sergeylukin/apps/website/src/pages/index.astro')
    )
    // @ts-ignore
    .action(async (filePath: string) => {
      try {
        const source = fs.readFileSync(filePath, { encoding: 'utf8' });
        const result = await parse(source, {
          position: false, // defaults to `true`
        });

        const o = convertAst(result.ast, path.basename(filePath).split('.')[0]);
        const components = o[1]();
        console.log('YEEEEEY', components);
        console.log(JSON.stringify([o[0], ...components], null, 2));
      } catch (e) {
        console.log('ERROR catched: ', e);
      }
    });

  program.parse();
};
