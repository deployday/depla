import * as path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import JSZip from 'jszip';
import { IGenerateStack, IEntity, Config } from 'depla';
import ejs from 'ejs';

export const generateSlice = async (
  generator,
  domain: IEntity[],
  config: Config
): Promise<IGenerateStack> => {
  const { runBefore, runAfter, zip } = await [null].concat(domain).reduce(
    async (accumulator, entity): Promise<IGenerateStack> => {
      const slice = await accumulator;
      const { runBefore, runAfter, zip } = generator(entity, domain, config);
      slice.runBefore.push(...runBefore);
      slice.runAfter.push(...runAfter);
      const zipContents = await zip.generateAsync({ type: 'nodebuffer' });
      slice.zip = await slice.zip.loadAsync(zipContents, {
        createFolders: true,
      });
      return Promise.resolve(slice);
    },
    Promise.resolve({
      runBefore: [],
      runAfter: [],
      zip: new JSZip(),
    })
  );

  return {
    runBefore,
    runAfter,
    zip,
  };
};

export const generateSliceForAllEntities = async (
  filesDir: string,
  config
): Promise<IGenerateStack> => {
  const runBefore = [];
  const runAfter = ['npx depla'];

  const files = await createZipFromFolder(filesDir);
  const newFiles = new JSZip();
  const keys = Object.keys(files.files);
  for (const key of keys) {
    const file = files.files[key];
    console.log(file.name);
    const fileObj = files.file(file.name);
    const isFile = fileObj;
    if (isFile) {
      const contents = await fileObj.async('string');
      const rendered = ejs.render(contents, config);
      files.remove(file.name);
      files.file(file.name.replace('.ejs', ''), rendered);
      // console.log('HEREREREREQQQQQUUUUU', files);

      // files.file(file.name.replace('.ejs', '')).lock();
      // files.lock();
      // console.log('=======', rendered);
    }
  }
  // console.log('YYYYYYY');
  // console.log('QWEQWEQWEQWEQWE', files);
  // const zipContents = await zip.generateAsync({ type: 'nodebuffer' });
  // stack.zip = await stack.zip.loadAsync(zipContents, {
  //   createFolders: true,
  // });

  return {
    runBefore,
    runAfter,
    zip: files,
  };
};

/**
 * Compresses a folder to the specified zip file.
 * @param {string} srcDir
 * @param {string} destFile
 */
export const compressFolder = async (
  srcDir: string,
  destFile: string
): Promise<void> => {
  //node write stream wants dest dir to already be created
  await fsp.mkdir(path.dirname(destFile), { recursive: true });

  const zip = await createZipFromFolder(srcDir);

  return new Promise((resolve, reject) => {
    zip
      .generateNodeStream({ streamFiles: true, compression: 'DEFLATE' })
      .pipe(fs.createWriteStream(destFile))
      .on('error', (err) => reject(err))
      .on('finish', resolve);
  });
};

/**
 * Returns a flat list of all files and subfolders for a directory (recursively).
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
const getFilePathsRecursively = async (dir: string): Promise<string[]> => {
  // returns a flat array of absolute paths of all files recursively contained in the dir
  const list = await fsp.readdir(dir);
  const statPromises = list.map(async (file) => {
    const fullPath = path.resolve(dir, file);
    const stat = await fsp.stat(fullPath);
    if (stat && stat.isDirectory()) {
      return getFilePathsRecursively(fullPath);
    }
    return fullPath;
  });

  // cast to string[] is ts hack
  // see: https://github.com/microsoft/TypeScript/issues/36554
  return (await Promise.all(statPromises)).flat(
    Number.POSITIVE_INFINITY
  ) as string[];
};

/**
 * Creates an in-memory zip stream from a folder in the file system
 * @param {string} dir
 * @returns {Promise<JSZip>}
 */
const createZipFromFolder = async (dir: string): Promise<JSZip> => {
  const absRoot = path.resolve(dir);
  const filePaths = await getFilePathsRecursively(dir);
  return filePaths.reduce((z, filePath) => {
    const relative = filePath.replace(absRoot, '');
    return z.file(relative, fs.createReadStream(filePath), {
      unixPermissions: '777', //you probably want less permissive permissions
    });
  }, new JSZip());
};
