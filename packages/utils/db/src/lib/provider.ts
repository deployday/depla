import { db } from './db-in-memory';

export const provider = (c: any) => {
  c.service('db', (c: any) => db);
};
