import path from 'node:path';
import fs from 'node:fs';
import mkdirp from 'mkdirp';

export const extractArchive = async (zip, context) => {
  return await zip.forEach(async (relativePath, file) => {
    const fileObj = zip.file(file.name);
    const isFile = fileObj;
    const filePath = path.resolve(path.join('./', relativePath));
    if (isFile) {
      if (
        !fs.existsSync(filePath) ||
        relativePath.indexOf('generated') !== -1
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
