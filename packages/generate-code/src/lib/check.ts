import {
  ActionsGenerator,
  EffectsGenerator,
  ReducerLogicGenerator,
} from '@depla/generate-stack';
import {
  generateScript,
  generateFullReducer,
  generateStack,
} from '@depla/generate-stack';
import { Config, Schema } from '@depla/generate-stack';
import { buildNameVariations } from '@depla/generate-stack';

describe('generate', () => {
  it('should work', () => {
    const events = ['play', 'pause', 'stop', 'reset', 'exit'];

    const config: Config = {
      name: 'Workshop Config',
      application: 'dashboard',
      scope: 'acme',
    };

    const schema: Schema = {
      model: 'game',
      modelPlural: 'games',
    };

    // <h3>Event Storming</h3>
    console.log(`${generateScript(schema, events)}`);

    // Events
    console.log(`${JSON.stringify(events, null, 2)}`);

    // Model Name Variations
    console.log(`${JSON.stringify(buildNameVariations(schema), null, 2)}`);

    // Actions
    console.log(`${generateStack(ActionsGenerator, events, schema, config)}`);

    // Effects
    console.log(`${generateStack(EffectsGenerator, events, schema, config)}`);

    // Reducer Logic
    console.log(
      `${generateStack(ReducerLogicGenerator, events, schema, config)}`
    );

    // Full Reducer
    console.log(`${generateFullReducer(events, schema, config)}`);
    // expect(generate()).toEqual('generate');
  });
});
