import { Config, Schema, Generator } from './meta-models';
import { buildNameVariations } from './engines/name-variations';

import {
  ActionsGenerator,
  EffectsGenerator,
  ReducerLogicGenerator,
  ReducerGenerator,
} from '../';

export const generateScript = (entity: Schema, events: string[]) =>
  events.reduce((code, event) => {
    code += `I should be able to ${event} a ${entity.model}\n`;
    return code;
  }, '');

export const generateStack = (
  generator: Generator,
  events: string[],
  entity: Schema,
  config: Config
) =>
  events.reduce((code, event) => {
    code += generator.generate(event, entity, config).template;
    return code;
  }, '');

export const generateFullReducer = (
  events: string[],
  entity: Schema,
  config: Config
) => {
  const logic = generateStack(ReducerLogicGenerator, events, entity, config);
  const reducer = ReducerGenerator.generate(logic, entity, config);
  return reducer.template;
};
