import * as path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import JSZip from 'jszip';
import { IGenerateStack, IEntity, Config } from 'depla';
import ejs from 'ejs';

export const generateSlice = async (
  generator,
  { domain, templatesPath, context }
): Promise<IGenerateStack> => {
  const { workspace, app } = context;
  const expectingInjections = [];

  const entityTemplateFiles = [];
  const files = await createZipFromFolder(templatesPath);
  const originalFiles = await createZipFromFolder(templatesPath);
  const keys = Object.keys(files.files);
  for (const key of keys) {
    const file = files.files[key];
    const fileObj = files.file(file?.name);
    const isFile = fileObj;
    const filename = file
      ? file.name.replace('.ejs', '').replaceAll('__app', context?.app?.name)
      : '';
    const isEJS = file?.name.indexOf('.ejs') !== -1;
    let contents;
    if (isFile) contents = await fileObj.async('string');
    if (filename.indexOf('__entity') !== -1) {
      if (isFile) {
        entityTemplateFiles.push({ name: file?.name, contents });
      }
    }
    if (isFile) {
      const rendered = isEJS ? ejs.render(contents, context) : contents;
      // if this file expects for injections, save a reference to it and
      // when all slices are done, re-render this file with all the injections
      // left by other slices
      const injects = new Set(contents.match(/injects\.(\w+)/g));
      if (injects.size) {
        injects.forEach((injectionName: string) => {
          expectingInjections.push({
            workspaceName: workspace?.name,
            appName: app?.name,
            filename,
            contents,
            injectionName: injectionName.replace('injects.', ''),
          });
        });
      }
      files.file(filename, rendered);
      if (file?.name !== filename) files.remove(file?.name);
    }
  }

  const { runBefore, runAfter, zip, writingInjections } = await []
    .concat(domain)
    .reduce(
      async (accumulator, entity): Promise<IGenerateStack> => {
        const slice = await accumulator;
        const generated = generator({
          ...context,
          entity,
          ...{ domain },
        });
        console.log(
          'Just finished RUYNNING generator for ENTITY',
          entity,
          slice,
          generated
        );
        const { runBefore, runAfter } = generated;
        const writingInjections = generated.writingInjections;
        console.log('HEREREREERERRERERASDAS', runBefore);

        const zip = new JSZip();
        for (let c = 0; c < entityTemplateFiles.length; c++) {
          const originalFilename = entityTemplateFiles[c].name;
          const contents = entityTemplateFiles[c].contents;
          const filename = originalFilename
            .replace('.ejs', '')
            .replaceAll('__app', context?.app?.name);
          const rendered = ejs.render(contents, {
            ...context,
            entityName: entity?.model,
          });
          zip.file(filename.replaceAll('__entity', entity?.model), rendered);
        }

        slice.runBefore.push(...runBefore);
        slice.runAfter.push(...runAfter);
        for (let [injectionName, injections] of Object.entries(
          writingInjections
        )) {
          const arr = slice.writingInjections[injectionName] || [];
          slice.writingInjections[injectionName] = [
            ...new Set(
              Object.values(
                [...arr, ...(injections as any[])].reduce((a, c) => {
                  a[c.name + '|' + c.module] = c;
                  return a;
                }, {})
              )
            ),
          ];
        }
        const zipContents = await zip.generateAsync({ type: 'nodebuffer' });
        slice.zip = await slice.zip.loadAsync(zipContents, {
          createFolders: true,
        });
        return Promise.resolve({
          ...slice,
          runBefore,
          runAfter,
          writingInjections,
        });
      },
      Promise.resolve({
        runBefore: [],
        runAfter: [],
        writingInjections: {},
        zip: new JSZip(),
      })
    );

  const zipContents = await files.generateAsync({ type: 'nodebuffer' });
  const fullZip = await zip.loadAsync(zipContents, {
    createFolders: true,
  });

  fullZip.forEach((relativePath) => {
    if (relativePath.indexOf('__entity') !== -1) fullZip.remove(relativePath);
  });

  return {
    runBefore,
    runAfter,
    zip: fullZip,
    writingInjections,
    expectingInjections,
  };
};

export const generateSliceForAllEntities = async (
  generator,
  { domain, templatesPath, context }
): Promise<IGenerateStack> => {
  const { runBefore, runAfter, writingInjections } = generator({
    ...context,
    ...{ domain },
  });
  const { workspace, app } = context;
  const expectingInjections = [];

  const files = await createZipFromFolder(templatesPath);
  const keys = Object.keys(files.files);
  for (const key of keys) {
    const file = files.files[key];
    const fileObj = files.file(file.name);
    const isFile = fileObj;
    if (isFile) {
      const contents = await fileObj.async('string');
      const rendered = ejs.render(contents, context);
      const filename = file.name
        .replace('.ejs', '')
        .replaceAll('__app', context?.app?.name);
      // if this file expects for injections, save a reference to it and
      // when all slices are done, re-render this file with all the injections
      // left by other slices
      const injects = new Set(contents.match(/injects\.(\w+)/g));
      if (injects.size) {
        injects.forEach((injectionName) => {
          expectingInjections.push({
            workspaceName: workspace.name,
            appName: app.name,
            filename,
            contents,
            injectionName: injectionName.replace('injects.', ''),
          });
        });
      }
      files.remove(file.name);
      files.file(filename, rendered);
    }
  }

  return {
    runBefore,
    runAfter,
    zip: files,
    writingInjections,
    expectingInjections,
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
