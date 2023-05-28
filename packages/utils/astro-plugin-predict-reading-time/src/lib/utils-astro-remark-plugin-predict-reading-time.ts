import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function readingTimeRemarkPlugin() {
  return function (tree: any, file: any) {
    const textOnPage = toString(tree);
    const readingTimeInMinutes = Math.ceil(getReadingTime(textOnPage).minutes);

    file.data.astro.frontmatter.readingTime = readingTimeInMinutes;
  };
}
