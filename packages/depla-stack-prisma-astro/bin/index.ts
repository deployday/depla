#!/usr/bin/env node

/* eslint-disable no-console */
'use strict';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.resolve(__dirname, '../', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const { node: requiredVersion } = packageJson.engines;
const requiredMajorVersion = parseInt(requiredVersion.replace(/[^0-9.]/g, ''));

const currentMajorVersion = parseInt(process.versions.node);

if (currentMajorVersion < requiredMajorVersion) {
  console.error(
    `Node.js v${currentMajorVersion} is out of date and unsupported!`
  );
  console.error(`Please use Node.js v${requiredMajorVersion} or higher.`);
  process.exit(1);
}

import('./run.js').then(({ main }) => main());
