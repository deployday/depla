import { getCollection, getEntryBySlug } from './collections';

export const collectionsProvider = (c: any) => {
  c.service('collections', (c: any) => {
    return {
      getCollection,
      getEntryBySlug,
    };
  });
};
