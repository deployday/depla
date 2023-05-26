import { IEntity } from './types.js';
import pluralize from 'pluralize';
import { camelCase, pascalCase } from './name-variations.js';

export const entityFactory = (name: string): IEntity => {
  const namePlural = pluralize(name);
  return {
    ref: camelCase(name),
    refs: camelCase(namePlural),
    model: pascalCase(name),
    models: pascalCase(namePlural),
  };
};
