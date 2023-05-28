import rss from '@astrojs/rss';

import { app } from '@astro-nx-depla/website/app';

export const prerender = true;

export const get = async () => {
  if (app.post.config.disabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await app.post.findMany();

  return rss({
    title: `${app.config.name}’s Blog`,
    description: app.config.description,
    site: import.meta.env.SITE,

    items: await Promise.all(
      posts.map(async (post) => {
        return {
          link: await app.post.getPostPermalink(post.permalink),
          title: post.title,
          description: post.description || ' ',
          pubDate: post.publishDate,
        };
      })
    ),
  });
};
