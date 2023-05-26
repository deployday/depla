import { readFile } from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import * as os from 'os';
import ejs from 'ejs';
import fs from 'fs';
import * as process from 'process';
import mkdirp from 'mkdirp';
// import * as p from '@clack/prompts';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import { generate } from '../src/index.js';
import {
  execBulk,
  getWorkspaceByName,
  createZipFromFolder,
  extractArchive,
} from 'depla';
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
      const workspace = getWorkspaceByName(
        workspaceName as string,
        config.workspaces
      );
      if (fs.existsSync(resolve(workspace.baseDir, 'nx.json'))) {
        console.log(
          chalk.green(
            `Workspace ${workspaceName} is already installed. Moving on...`
          )
        );
        return Promise.resolve();
      }

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const templatesPath = path.resolve(__dirname, `../files`);
      const zip = await createZipFromFolder(templatesPath);
      const keys = Object.keys(zip.files);
      for (const key of keys) {
        const file = zip.files[key];
        const fileObj = zip.file(file?.name);
        const isFile = fileObj;
        const filename = file ? file.name.replace('.ejs', '') : '';
        const isEJS = file?.name.indexOf('.ejs') !== -1;
        const context = {
          workspaceName,
        };
        let contents;
        if (isFile) {
          contents = await fileObj.async('string');
          const rendered = isEJS ? ejs.render(contents, context) : contents;
          zip.file(filename, rendered);
          if (file?.name !== filename) zip.remove(file?.name);
        }
      }

      const { runBefore } = await generate(workspace);
      await execBulk(runBefore);

      await extractArchive(zip, { workspace: { name: workspaceName } });
    });

  program.parse();
};
