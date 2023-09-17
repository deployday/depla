import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, e as renderSlot, m as maybeRenderHead, f as renderComponent } from '../astro.4a7ce0d2.mjs';
import 'html-escaper';
/* empty css                           */import GetSitemapLinks from 'get-sitemap-links';

const $$Astro$2 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${title}</title>
  ${renderHead()}</head>

  <body>
    ${renderSlot($$result, $$slots["default"])}
  </body></html>`;
}, "/Users/sergey/code/deployday/depla/apps/website/src/layouts/Layout.astro");

const $$Astro$1 = createAstro();
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Card;
  const { href, title, body } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li class="link-card astro-DOHJNAO5">
  <a${addAttribute(href, "href")} class="astro-DOHJNAO5">
    <h2 class="astro-DOHJNAO5">
      ${title}
      <span class="astro-DOHJNAO5">&rarr;</span>
    </h2>
    <p class="astro-DOHJNAO5">
      ${body}
    </p>
  </a>
</li>`;
}, "/Users/sergey/code/deployday/depla/apps/website/src/components/Card.astro");

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "class": "astro-J7PV25F6" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<main class="astro-J7PV25F6">
    <h1 class="astro-J7PV25F6">Welcome to <span class="text-gradient astro-J7PV25F6">Astro</span></h1>
    <p class="instructions astro-J7PV25F6">
      To get started, open the directory <code class="astro-J7PV25F6">src/pages</code> in your project.<br class="astro-J7PV25F6">
      <strong class="astro-J7PV25F6">Code Challenge:</strong> Tweak the "Welcome to Astro" message above.
    </p>
    <ul role="list" class="link-card-grid astro-J7PV25F6">
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://docs.astro.build/", "title": "Documentation", "body": "Learn how Astro works and explore the official API docs.", "class": "astro-J7PV25F6" })}
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/integrations/", "title": "Integrations", "body": "Supercharge your project with new frameworks and libraries.", "class": "astro-J7PV25F6" })}
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/themes/", "title": "Themes", "body": "Explore a galaxy of community-built starter themes.", "class": "astro-J7PV25F6" })}
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/chat/", "title": "Astro Community", "body": "Come say hi to our amazing Astro Discord community. \u2764\uFE0F", "class": "astro-J7PV25F6" })}
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://nx.dev/", "title": "Nx", "body": "Learn more about Nx.", "class": "astro-J7PV25F6" })}
      ${renderComponent($$result2, "Card", $$Card, { "href": "https://nrwlcommunity.slack.com/", "title": "Nrwl Community Slack", "body": "Come chat in the Nrwl Community Slack. \u2764\uFE0F", "class": "astro-J7PV25F6" })}
    </ul>
  </main>
` })}`;
}, "/Users/sergey/code/deployday/depla/apps/website/src/pages/index.astro");

const $$file = "/Users/sergey/code/deployday/depla/apps/website/src/pages/index.astro";
const $$url = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const convertSitemapToDomainModels = async (sitemap) => {
  const array = await GetSitemapLinks(sitemap);
  return convertURIListToCollectionsNamesList(array);
};
const convertURIListToCollectionsNamesList = (list) => {
  const models = list.reduce(
    (prev, curr) => {
      const parts = curr.split("/");
      const category = parts[3];
      const page = `/${category}`;
      if (!prev.collectionInstancesMap?.[category]) {
        prev.collectionInstancesMap[category] = 1;
        if (page)
          prev.pagesURIs.push(page);
      } else {
        if (prev.collectionsNames.indexOf(category) === -1)
          prev.collectionsNames.push(category);
        const pageIndex = prev.pagesURIs.indexOf(page);
        if (pageIndex !== -1)
          prev.pagesURIs.splice(pageIndex, 1);
      }
      return prev;
    },
    {
      collectionInstancesMap: {},
      collectionsNames: [],
      pagesURIs: []
    }
  );
  return {
    collections: models.collectionsNames,
    pages: models.pagesURIs
  };
};

async function get({ request }) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  const domain = params.get('domain');
  const sitemap = `https://${domain}/sitemap_index.xml`;
  const { collections, pages } = await convertSitemapToDomainModels(sitemap);

  if (!collections && !pages) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  return new Response(JSON.stringify({ collections, pages }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a };
