import { env } from './environment';

export const provider = (c: any) => {
  c.service('env', (c: any) => env);
};
