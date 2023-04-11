// @ts-nocheck
import { writeFile, readdir } from 'node:fs/promises';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { mkdirp } from 'mkdirp';
// import { loadImage } from '@astro-nx-depla/shared/util/image';

const defaultSizes = [767, 1023, 2040];

interface IFile {
  path: string;
  webP: string;
}

const build = async ({
  paths,
  sizes,
}: {
  paths: { src: string; dest: string };
  sizes: number[];
}) => {
  const filesToProcess: IFile[] = [];

  function getDestinationFilePathless(source: string, s: string) {
    let destination = path.join(paths.dest, s.toString(), source);
    destination = destination.replace(path.parse(destination).ext, '');
    return destination;
  }

  async function recurseFiles(directory: string) {
    const f = await readdir(path.join(paths.src, directory), {
      withFileTypes: true,
    });

    for (const file of f) {
      if (file.isDirectory()) {
        const nextDirectory = path.join(directory, file.name);
        await recurseFiles(nextDirectory);
      } else {
        const ext = path.parse(file.name).ext;

        switch (ext) {
          case '.jpg':
          case '.jpeg':
          case '.png':
          case '.webp':
            const sourcePath = path.join(directory, file.name);

            const webP = sourcePath.replace(/.jpg$|.jpeg$|.png$/, '.webp');
            const info = {
              path: sourcePath,
              webP: webP,
            };

            const fullDestination = path.join(paths.dest, 'x', info.path);

            if (!fs.existsSync(fullDestination)) {
              filesToProcess.push(info);
            }

            // The code below uses modified dates (and will update more images than the above)
            // const fullPath = path.join(paths.src, info.path);
            // const modified = fs.statSync(fullPath).mtime;

            // const destinationModified = fs.existsSync(fullDestination)
            //     ? fs.statSync(fullDestination).mtime
            //     : new Date(0);

            // if (destinationModified < modified) {
            //     filesToProcess.push(info);
            // }
            break;
        }
      }
    }
  }

  await recurseFiles('');

  console.log(`Found ${filesToProcess.length} files to process`);

  for (const file of filesToProcess) {
    console.log(file.path);
    console.log(paths.src, 'SAASDASD');
    // const img = await loadImage(file.path);
    console.log('=========');
    // console.log(img);
    const source = path.join(paths.src, file.path);
    const destination = getDestinationFilePathless(file.path, 'x');
    const madeDir = await mkdirp(path.dirname(destination));
    console.log('MADEDIR', madeDir);

    const ext = path.parse(source).ext;

    switch (ext) {
      case '.png':
        sharp(source)
          .png()
          .toFile(destination + '.png');
        break;
      case '.jpg':
      case '.jpeg':
        sharp(source)
          .jpeg({ mozjpeg: true })
          .toFile(destination + '.jpg');
        break;
      case '.webp':
        sharp(source)
          .webp({ quality: 80 })
          .toFile(destination + '.webp');
        break;
    }

    const info = await sharp(source).metadata();

    const metadata = {
      width: info.width,
      height: info.height,
      sizeInBytes: info.size,
    };

    const metaFile = source + '.json';
    await writeFile(metaFile, JSON.stringify(metadata));

    // Create resized images
    for (const size of sizes) {
      const resizeDestination = getDestinationFilePathless(file.path, size);
      const madeDir2 = await mkdirp(path.dirname(resizeDestination));
      console.log('MADEDIR2', madeDir2);

      const metadata = await sharp(source).metadata();

      if (metadata.width > size) {
        // Only resize if the image is larger than the target size
        sharp(source)
          .resize(size, null)
          .webp({ quality: 80 })
          .toFile(resizeDestination + '.webp');
      } else {
        // Don't resize as it's smaller than target size
        sharp(source)
          .webp({ quality: 80 })
          .toFile(resizeDestination + '.webp');
      }
    }
  }
};

const createResponsiveImageIntegration = ({
  folder = '_img',
  sizes = defaultSizes,
}: {
  folder: string;
  sizes: number[];
}) => ({
  name: 'astro-responsive-image',
  hooks: {
    'astro:build:done': async ({ dir, routes }) => {
      const paths = {
        src: fileURLToPath(new URL(`./_astro`, dir)),
        dest: fileURLToPath(new URL(`./${folder}`, dir)),
      };
      await build({ paths, sizes });
    },
  },
});

export default createResponsiveImageIntegration;
