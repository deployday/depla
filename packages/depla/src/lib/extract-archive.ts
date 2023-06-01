import path from 'node:path';
import fs from 'node:fs';
import mkdirp from 'mkdirp';

type overwriteCallback = (filePath: string, relativePath: string) => boolean;

export const extractArchive = async (
  zip,
  context,
  overwriteCallback: overwriteCallback = (filePath = '', relativePath = '') =>
    false
) => {
  return await zip.forEach(async (relativePath, file) => {
    const fileObj = zip.file(file.name);
    const isFile = fileObj;
    const filePath = path.resolve(path.join('./', relativePath));
    if (isFile) {
      if (
        !fs.existsSync(filePath) ||
        relativePath.indexOf('generated') !== -1 ||
        overwriteCallback(filePath, relativePath)
      ) {
        fs.writeFileSync(
          filePath,
          Buffer.from(await fileObj.async('arraybuffer'))
        );
      }
    } else {
      const dirPath = path.resolve(path.join('./', relativePath));
      mkdirp.sync(dirPath);
    }
  });
};
