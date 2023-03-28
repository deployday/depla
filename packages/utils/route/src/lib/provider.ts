import { route } from './route';

export const provider = (c: any) => {
  c.service('route', (c: any) => route);
};
