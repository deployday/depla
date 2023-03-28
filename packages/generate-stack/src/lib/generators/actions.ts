import {
  buildEventVariations,
  buildNameVariations,
} from '../engines/name-variations';
import { Config, Schema, Generator } from '../meta-models';

const generate = (eventName: string, schema: Schema, { scope }: Config) => {
  const { model, models, singleParam } = buildNameVariations(schema);
  const { label, title } = buildEventVariations(eventName);

  const template = `
// ${title} ${model} Actions
export const ${label}${model} = createAction(
  '[${models}] ${title} ${model}',
  props<{ ${singleParam} }>()
);

export const ${label}${model}Success = createAction(
  '[${models}] ${title} ${model} Success',
  props<{ ${singleParam} }>()
);

export const ${label}${model}Failure = createAction(
  '[${models}] ${title} ${model} Failure',
  props<{ error: any }>()
);
`;

  return {
    template,
  };
};

export const ActionsGenerator: Generator = {
  generate,
};
