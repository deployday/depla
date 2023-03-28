import {
  buildEventVariations,
  buildNameVariations,
} from '../engines/name-variations';
import { Config, Schema, Generator } from '../meta-models';

const generate = (eventName: string, schema: Schema, { scope }: Config) => {
  const { ref, refs, model, models, singleParam } = buildNameVariations(schema);
  const { label, title } = buildEventVariations(eventName);

  const template = `
// ${title} ${model} Effect
@Effect() ${label}${model}\$ = this.actions\$.pipe(
  ofType(${models}Actions.${label}${model}), // Trigger Event
  pessimisticUpdate({
    run: (action) => this.${refs}Service.${label}(action.${ref}).pipe(
      map((${singleParam}) => ${models}Actions.${label}${model}Success({ ${ref} })) // Completion Event
    ),
    onError: (action, error) => ${models}Actions.${label}${model}Failure({ error }) // Completion Event
  })
);
  `;

  return {
    template,
  };
};

export const EffectsGenerator: Generator = {
  generate,
};
