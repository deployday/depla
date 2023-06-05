import {
  getSchema,
  printSchema,
  createPrismaSchemaBuilder,
} from '@mrleebo/prisma-ast';
import mkdirp from 'mkdirp';
import { readFile } from 'fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { Command, CommandUnknownOpts } from '@commander-js/extra-typings';

import { getWorkspaceByName, entityFactory } from 'depla';

const program: CommandUnknownOpts = new Command();
program
  .name('Obsidian PDF album creator')
  .description('Create printable styled PDF album from Obsidian');

export const main = () => {
  program
    .argument('[workspace]', 'what workspace shall we use', '')
    // @ts-ignore
    .action(async (workspaceName) => {
      try {
        const config = JSON.parse(
          (await readFile(path.resolve('depla.json'))).toString()
        );
        const currentDirectoryName = path.resolve('./').split(path.sep).pop();
        const workspace = getWorkspaceByName(
          (workspaceName as string) || (currentDirectoryName as string),
          config.workspaces
        );
        const deplaDir = path.resolve('.depla');
        if (!fs.existsSync(deplaDir)) {
          mkdirp.sync(deplaDir);
        }
        const domainJSONPath = path.resolve('./.depla', 'domain.json');
        const source = fs
          .readFileSync(path.resolve('prisma/schema.prisma'))
          .toString();

        const schema = getSchema(source);

        const domainJSON = schema.list.reduce(
          (acc, obj, index) => {
            if (obj.type === 'model') {
              const flags = [...acc.recentItemFlags];
              acc.recentItemFlags = [];
              if (flags.indexOf('ignore') === -1) {
                acc.entities.push(entityFactory(obj.name.trim()));
              }
            } else if (obj.type === 'comment') {
              const flagMatch = obj.text.match(/@depla FLAG (\w+)?$/);
              if (flagMatch) {
                acc.recentItemFlags.push(flagMatch[1]);
              }
            } else {
              acc.recentItemFlags = [];
            }
            if (index + 1 === schema.list.length) delete acc.recentItemFlags;
            return acc;
          },
          { entities: [], recentItemFlags: [] }
        );
        // Write all the entities into .depla/domain.json
        fs.writeFileSync(domainJSONPath, JSON.stringify(domainJSON, null, 2));
      } catch (e) {
        console.log('ERROR catched: ', e);
      }
    });

  program.parse();
};
