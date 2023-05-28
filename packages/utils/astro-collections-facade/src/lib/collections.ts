// @ts-ignore
let content;
try {
  content = require('astro:content');
} catch (e) {
  console.log('failed to load astro:content');
}

export const getCollection = content.getCollection;
export const getEntryBySlug = content.getEntryBySlug;
