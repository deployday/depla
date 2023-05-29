import path from 'node:path';
import fs from 'node:fs';
import mkdirp from 'mkdirp';

export const transferBlobs = async (blobs, to) => {
  return await blobs.forEach(async ({ absolutePath, relativePath }) => {
    const destinationFilePath = path.join(to, relativePath);
    if (
      !fs.existsSync(destinationFilePath) ||
      relativePath.indexOf('generated') !== -1
    ) {
      const folders = destinationFilePath.split(path.sep).slice(0, -1);
      if (folders.length) {
        // create folder path if it doesn't exist
        console.log('GOT FOLDERS TO CREATE');
        folders.reduce((last, folder) => {
          const folderPath = last ? last + path.sep + folder : `/${folder}`;
          if (!fs.existsSync(folderPath)) {
            console.log('CREATING ', folderPath);
            fs.mkdirSync(folderPath);
          } else {
            console.log('NOT CREATING ', folderPath);
          }
          return folderPath;
        });
      }
      fs.copyFile(absolutePath, destinationFilePath, (err) => {
        console.log('oops ', err);
      });
    }
  });
};
