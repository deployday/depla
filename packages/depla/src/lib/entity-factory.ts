import { IEntity } from './types.js';
import pluralize from 'pluralize';

export const entityFactory = (entity: string): IEntity => {
  return {
    model: entity,
    modelPlural: pluralize(entity),
  };
};
