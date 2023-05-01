import path from 'node:path';
import fs from 'node:fs';
import mkdirp from 'mkdirp';

export const extractArchive = async (zip, context) => {
  return await zip.forEach(async (relativePath, file) => {
    const fileObj = zip.file(file.name);
    const isFile = fileObj;
    if (isFile) {
      fs.writeFileSync(
        path.resolve(path.join('./', relativePath)),
        Buffer.from(await fileObj.async('arraybuffer'))
      );
    } else {
      const dirPath = path.resolve(path.join('./', relativePath));
      mkdirp.sync(dirPath);
    }
  });
};
