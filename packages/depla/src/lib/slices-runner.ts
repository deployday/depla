import * as fs from 'fs';
import { resolve } from 'node:path';
export const slicesRunner = () => {
  console.log('QUNNER');
  const config = fs.readFileSync(resolve('./depla.json'));
  console.log('UUU', JSON.parse(config.toString()));
};
