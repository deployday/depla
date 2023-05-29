import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import JSZip from 'jszip';

/**
 * Creates an in-memory zip stream from a folder in the file system
 * @param {string} dir
 * @returns {Promise<JSZip>}
 */
export const createZipFromFolder = async (dir: string): Promise<JSZip> => {
  const absRoot = path.resolve(dir);
  const filePaths = await getFilePathsRecursively(dir);
  return filePaths.reduce((z, filePath) => {
    const relative = filePath.replace(absRoot, '');
    const isBinary = !!filePath?.match(/jpg|jpeg|png|webp/);
    const stream = fs.createReadStream(filePath);
    console.log('SRRRRRR', stream);
    if (!isBinary) {
      return z.file(relative, stream, {
        unixPermissions: '777', //you probably want less permissive permissions
      });
    } else {
      return z;
    }
  }, new JSZip());
};

export const createListOfBlobsFromFolder = async (
  dir: string,
  formatter = null
) => {
  const filePaths = await getFilePathsRecursively(dir);
  return filePaths.reduce((list, path) => {
    const isBinary = !!path?.match(/jpg|jpeg|png|webp/);
    if (isBinary) {
      const formattedPath = formatter ? formatter(path) : path;
      list.push({
        relativePath: formattedPath.replace(dir, ''),
        absolutePath: path,
      });
    }
    return list;
  }, []);
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
