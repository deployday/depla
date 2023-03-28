import {
  buildEventVariations,
  buildNameVariations,
} from '../engines/name-variations';
import { Config, Schema, Generator } from '../meta-models';

const generateReducerLogic = (
  eventName: string,
  schema: Schema,
  { scope }: Config
) => {
  const { ref, refs, model, models } = buildNameVariations(schema);
  const { label, title } = buildEventVariations(eventName);

  const template = `
  // ${title} ${model} Reducer Logic
  on(${models}Actions.${label}${model}Success, (state, { ${ref} }) =>
    // Modify ${refs} state slice based on action success
    return state;
  ),
  on(${models}Actions.${label}${model}Failure, onFailure),
  `;

  return {
    template,
  };
};

const generateReducer = (
  reducerLogic: string,
  schema: Schema,
  { scope }: Config
) => {
  const { refs, model, models } = buildNameVariations(schema);
  const constantCase = refs.toUpperCase();

  const template = `
import { ${model} } from '@${scope}/api-interfaces';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ${models}Actions from './${schema.modelPlural}.actions';

export const ${constantCase}_FEATURE_KEY = '${refs}';

export interface ${models}State extends EntityState<${model}> {
  selectedId?: string | number; // which ${models} record has been selected
  loaded: boolean; // has the ${models} list been loaded
  error?: string | null; // last known error (if any)
}

export interface ${models}PartialState {
  readonly [${constantCase}_FEATURE_KEY]: ${models}State;
}

export const ${refs}Adapter: EntityAdapter<${model}> = createEntityAdapter<${model}>();

export const initial${models}State: ${models}State = ${refs}Adapter.getInitialState({
  // set initial required properties
  loaded: false
});

const onFailure = (state, { error }) => ({ ...state, error});

const _${refs}Reducer = createReducer(
  initial${models}State,
  ${reducerLogic}
);

export function ${refs}Reducer(state: ${models}State | undefined, action: Action) {
  return _${refs}Reducer(state, action);
}
  `;

  return {
    template,
  };
};

export const ReducerLogicGenerator: Generator = {
  generate: generateReducerLogic,
};

export const ReducerGenerator: Generator = {
  generate: generateReducer,
};
