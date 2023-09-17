import GetSitemapLinks from 'get-sitemap-links';

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

export { get };
