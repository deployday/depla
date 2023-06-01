import * as path from 'node:path';
import JSZip from 'jszip';
import { Config, IBlob, IGenerateStack, IEntity } from './types.js';
import {
  createListOfBlobsFromFolder,
  createZipFromFolder,
} from './archive-folder.js';
import ejs from 'ejs';
import { helpers } from './ejs-helpers.js';

export const generateSlice = async (
  generator,
  { templatesPath, context }
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
    const isEntityFile = filename.indexOf('__entity') !== -1;
    if (isEntityFile && isFile) {
      entityTemplateFiles.push({ name: file?.name, contents });
    }
    if (isFile) {
      console.log('~~~GENERATIIIIIING ', file.name);
      const rendered =
        isEJS && !isEntityFile
          ? ejs.render(contents, { ...helpers, ...context })
          : contents;
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
    .concat(context?.domain)
    .reduce(
      async (accumulator, entity): Promise<IGenerateStack> => {
        const slice = await accumulator;
        const generated = generator({
          ...context,
          entity,
        });
        console.log(
          'Just finished RUYNNING generator for ENTITY',
          entity,
          slice,
          generated
        );
        const { runBefore, runAfter } = generated;
        const writingInjections = {
          ...generated.writingInjections,
        };
        console.log('HEREREREERERRERERASDAS', runBefore);

        const zip = new JSZip();
        for (let c = 0; c < entityTemplateFiles.length; c++) {
          const originalFilename = entityTemplateFiles[c].name;
          const contents = entityTemplateFiles[c].contents;
          const filename = originalFilename
            .replace('.ejs', '')
            .replaceAll('__app', context?.app?.name);
          console.log('GENERATIIIIIING ', filename, entity);
          const rendered = ejs.render(contents, {
            ...helpers,
            ...context,
            entity,
          });
          zip.file(filename.replaceAll('__entity', entity?.ref), rendered);
        }

        slice.runBefore = [...slice.runBefore, ...runBefore];
        slice.runAfter = [...slice.runAfter, ...runAfter];
        for (const [injectionName, injections] of Object.entries(
          writingInjections
        )) {
          const arr = slice.writingInjections[injectionName] || [];
          slice.writingInjections[injectionName] = [
            ...new Set(
              Object.values(
                [...arr, ...(injections as any[])].reduce((a, b) => {
                  a[b.name + '|' + b.module] = b;
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
        return Promise.resolve(slice);
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
  { templatesPath, context }
): Promise<IGenerateStack> => {
  const { runBefore, runAfter, writingInjections } = generator({
    ...context,
  });
  const { workspace, app } = context;
  const expectingInjections = [];

  const blobs: IBlob[] = await createListOfBlobsFromFolder(
    templatesPath,
    (name) => name.replaceAll('__app', context?.app?.name)
  );

  const files = await createZipFromFolder(templatesPath);
  const keys = Object.keys(files.files);
  for (const key of keys) {
    const file = files.files[key];
    const fileObj = files.file(file.name);
    const isFile = fileObj;
    const isEJS = file?.name.indexOf('.ejs') !== -1;
    if (isFile) {
      const contents = await fileObj.async('string');
      const rendered = isEJS
        ? ejs.render(contents, { ...helpers, ...context })
        : contents;
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
    blobs,
    writingInjections,
    expectingInjections,
  };
};
