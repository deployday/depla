import JSZip from 'jszip';
import { IGenerateStack, IEntity, ILayer, Config } from 'depla';
import { generateLayer } from './generate-layer.js';

export const generateStack = async (
  layers: ILayer[],
  domain: IEntity[],
  config: Config
): Promise<IGenerateStack> => {
  const { commands, zip } = await layers.reduce(
    async (accumulator, layer): Promise<IGenerateStack> => {
      const stack = await accumulator;
      const { commands, zip } = generateLayer(layer.generator, domain, config);
      stack.commands.push(...commands);
      const zipContents = await zip.generateAsync({ type: 'nodebuffer' });
      stack.zip = await stack.zip.loadAsync(zipContents, {
        createFolders: true,
      });
      return Promise.resolve(stack);
    },
    Promise.resolve({
      commands: [],
      zip: new JSZip(),
    })
  );

  return {
    commands,
    zip,
  };
};
