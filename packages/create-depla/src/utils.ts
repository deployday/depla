import * as fs from 'fs';
import Debug from 'debug';
import { CommandUnknownOpts } from '@commander-js/extra-typings';

export const rootDebug = Debug('unpacker');

export const printVerboseHook = (thisCommand: CommandUnknownOpts) => {
  const options = thisCommand.opts();

  if (options['verbose']) {
    Debug.enable('unpacker*');
    rootDebug(`CLI arguments`);
    rootDebug(options);
  }
};
