import { db } from './db';

export const provider = (c: any) => {
  c.service('db', (c: any) => db);
};
