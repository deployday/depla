// @ts-nocheck
import * as path from 'path';
import * as fs from 'fs';
import { spawn, ChildProcess, exec } from 'child_process';
import chalk from 'chalk';
import { Readable, Writable } from 'stream';
import { WriteStream } from 'fs';
import { EventEmitter } from 'events';
/**
 * Usage:
 * <pre>
 * await streamWrite(someStream, 'abc');
 * await streamWrite(someStream, 'def');
 * await streamEnd(someStream);
 * </pre>
 *
 * @see https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_writable_write_chunk_encoding_callback
 */
export function streamWrite(
  stream: Writable,
  chunk: string | Buffer | Uint8Array,
  encoding = 'utf8'
): Promise<void> {
  // Get notified via callback when it’s “safe” to write again.
  // The alternatives are:
  // – 'drain' event waits until buffering is below “high water mark”
  // – callback waits until written content is unbuffered
  let b: BufferEncoding;
  return streamPromiseHelper(stream, (callback) =>
    stream.write(chunk, b, callback)
  );
}

export function streamEnd(stream: Writable): Promise<void> {
  return streamPromiseHelper(stream, (callback) => stream.end(callback));
}

function streamPromiseHelper(
  emitter: EventEmitter,
  operation: (callback: () => void) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const errListener = (err: Error) => {
      emitter.removeListener('error', errListener);
      reject(err);
    };
    emitter.addListener('error', errListener);
    const callback = () => {
      emitter.removeListener('error', errListener);
      resolve(undefined);
    };
    operation(callback);
  });
}

const onExit = (childProcess: ChildProcess): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code: number, signal: string) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error('Exit with error code: ' + code));
      }
    });
    childProcess.once('error', (err: Error) => {
      reject(err);
    });
  });
};

const RE_NEWLINE = /\r?\n$/u;
function chomp(line: string): string {
  const match = RE_NEWLINE.exec(line);
  if (!match) return line;
  return line.slice(0, match.index);
}

/**
 * Parameter: async iterable of chunks (strings)
 * Result: async iterable of lines (incl. newlines)
 */
async function* chunksToLinesAsync(
  chunks: AsyncIterable<string>
): AsyncIterable<string> {
  if (!Symbol.asyncIterator) {
    throw new Error(
      'Current JavaScript engine does not support asynchronous iterables'
    );
  }
  if (!(Symbol.asyncIterator in chunks)) {
    throw new Error('Parameter is not an asynchronous iterable');
  }
  let previous = '';
  for await (const chunk of chunks) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

const echoReadable = async (readable) => {
  for await (const line of chunksToLinesAsync(readable)) {
    console.log(chomp(line));
  }
};

export const execCommandAndStreamOutput = async (
  cmd: string,
  cwd: string = process.cwd()
) => {
  if (!cmd.trim()) return Promise.resolve();
  const subcommands = cmd.replace(`;;`, 'SPECIAL_CHAR_TMP').split(/;|&&/);
  for (let i = 0; i < subcommands.length; i++) {
    const subcommand = subcommands[i].split('>')?.[0]?.trim();
    const outFilePath = subcommands[i].split('>')?.[1]?.trim();
    const outFileResolvedPath = path.join(cwd, `/${outFilePath}`);
    console.log(chalk.yellow(subcommand));
    if (!subcommand) return Promise.resolve();
    let childProcess: ChildProcess;
    const cmdStr = subcommand.replace('SPECIAL_CHAR_TMP', ';');
    if (subcommand.indexOf('|') !== -1) {
      childProcess = await spawnWithPipe(cmdStr, cwd, outFilePath);
    } else {
      childProcess = spawnIt(cmdStr, cwd, outFilePath);
    }
    if (outFilePath) {
      const stdOutStream = fs.createWriteStream(outFileResolvedPath, {
        flags: 'a',
      });
      for await (const line of chunksToLinesAsync(childProcess.stdout)) {
        stdOutStream.write(line);
      }
      stdOutStream.end();
    }

    await onExit(childProcess);
  }
};

export const execBulk = async (commands) => {
  const defaultCWD = path.resolve('./');
  let cwd, cmd;
  for (let i = 0; i < commands.length; i++) {
    try {
      cmd = commands[i];
      if (Array.isArray(commands[i])) {
        [cmd, cwd = defaultCWD] = commands[i];
        console.log('OPOPOPOPOPOPOPOP', cmd, cwd);
      }
      cmd = cmd.replace(/\\|\r?\n|\r/g, ' ').trim();
      await execCommandAndStreamOutput(cmd, cwd);
    } catch (e) {
      console.log('CATCHED', e);
    }
  }
};

const spawnWithPipe = async (cmd, cwd, outFilePath) => {
  const [sourceCmd, sinkCmd] = cmd.split('|');
  const [sourceCmdExecutable, ...sourceCmdArgs] = sourceCmd.trim().split(' ');
  const sourceCmdArgsTrimmed = [
    sourceCmdArgs
      .filter((arg) => arg)
      .join(' ')
      .trim(),
  ];
  const [sinkCmdExecutable, ...sinkCmdArgs] = sinkCmd.trim().split(' ');
  const sinkCmdArgsTrimmed = [
    sinkCmdArgs
      .filter((arg) => arg)
      .join(' ')
      .trim(),
  ];
  const source = spawn(sourceCmdExecutable, sourceCmdArgsTrimmed, {
    stdio: ['ignore', 'pipe', process.stderr],
  });
  const sink = spawn(sinkCmdExecutable, sinkCmdArgsTrimmed, {
    stdio: outFilePath
      ? ['pipe', 'pipe', process.stderr]
      : ['pipe', process.stdout, process.stderr],
  });
  await transform(source.stdout, sink.stdin);
  return sink;
};

const spawnIt = (cmd, cwd, outFilePath) => {
  const [executable, ...args] = cmd.split(' ');
  const argsTrimmed = args.filter((arg) => arg);

  const childProcess = spawn(executable, argsTrimmed, {
    cwd,
    stdio: outFilePath
      ? ['ignore', 'pipe', process.stderr]
      : [process.stdin, process.stdout, process.stderr],
  });
  return childProcess;
};

async function transform(readable, writable) {
  for await (const line of chunksToLinesAsync(readable)) {
    await streamWrite(writable, '@ ' + line);
  }
  await streamEnd(writable);
}
