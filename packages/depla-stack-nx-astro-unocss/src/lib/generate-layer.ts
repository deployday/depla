import { IGenerateStack } from 'depla';
import JSZip from 'jszip';

export const generateLayer = (generator, domain, config): IGenerateStack => {
  const zip = new JSZip();
  zip.file('hellofromlayer.txt', 'HAAAAAALL');
  const folder = generator();
  console.log('saving ' + folder);
  zip.folder(folder).file('oppa.txt', 'Hello World\n');
  return {
    runBefore: ['echo hey hey wowo ' + folder],
    runAfter: [],
    zip,
  };
};
