import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { renderers } from './renderers.mjs';
import 'mime';
import 'cookie';
import 'kleur/colors';
import { g as deserializeManifest } from './chunks/astro.4a7ce0d2.mjs';
import '@astrojs/internal-helpers/path';
import 'html-escaper';
import 'solid-js/web';
import 'path-to-regexp';
import 'string-width';

const _page0  = () => import('./chunks/index@_@astro.45eefe2e.mjs');
const _page1  = () => import('./chunks/apps@_@astro.008ca1c7.mjs');
const _page2  = () => import('./chunks/auth@_@astro.9c138ce2.mjs');
const _page3  = () => import('./chunks/extract@_@js.aeafac4b.mjs');
const _page4  = () => import('./chunks/niches@_@js.b559f9d8.mjs');const pageMap = new Map([["src/pages/index.astro", _page0],["src/pages/apps.astro", _page1],["src/pages/auth.astro", _page2],["src/pages/api/extract.js", _page3],["src/pages/api/niches.js", _page4]]);
const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/apps.ca893883.css"},{"type":"external","src":"/_astro/index.05414bc5.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/apps.ca893883.css"}],"routeData":{"route":"/apps","type":"page","pattern":"^\\/apps\\/?$","segments":[[{"content":"apps","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/apps.astro","pathname":"/apps","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/apps.ca893883.css"}],"routeData":{"route":"/auth","type":"page","pattern":"^\\/auth\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth.astro","pathname":"/auth","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/extract","type":"endpoint","pattern":"^\\/api\\/extract$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"extract","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/extract.js","pathname":"/api/extract","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/niches","type":"endpoint","pattern":"^\\/api\\/niches$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"niches","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/niches.js","pathname":"/api/niches","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"base":"/","compressHTML":false,"markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true},"componentMetadata":[["/Users/sergey/code/deployday/depla/apps/website/src/pages/apps.astro",{"propagation":"none","containsHead":true}],["/Users/sergey/code/deployday/depla/apps/website/src/pages/auth.astro",{"propagation":"none","containsHead":true}],["/Users/sergey/code/deployday/depla/apps/website/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,n)=>{let s=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),s();break}});for(let e of n.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/auth.astro":"chunks/pages/auth.astro.e84aea7d.mjs","/src/pages/api/extract.js":"chunks/pages/extract.js.16ca1a09.mjs","/src/pages/index.astro":"chunks/pages/index.astro.9c857d36.mjs","/src/pages/api/niches.js":"chunks/pages/niches.js.35156a9f.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index@_@astro.45eefe2e.mjs","\u0000@astro-page:src/pages/apps@_@astro":"chunks/apps@_@astro.008ca1c7.mjs","\u0000@astro-page:src/pages/auth@_@astro":"chunks/auth@_@astro.9c138ce2.mjs","\u0000@astro-page:src/pages/api/extract@_@js":"chunks/extract@_@js.aeafac4b.mjs","\u0000@astro-page:src/pages/api/niches@_@js":"chunks/niches@_@js.b559f9d8.mjs","@astrojs/solid-js/client.js":"_astro/client.776ae22e.js","/Users/sergey/code/deployday/depla/apps/website/src/components/auth":"_astro/auth.ebabda63.js","/Users/sergey/code/deployday/depla/apps/website/src/components/apps":"_astro/apps.d3cf32c2.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/apps.ca893883.css","/_astro/index.05414bc5.css","/favicon.svg","/_astro/UsersService.cfaa1654.js","/_astro/apps.d3cf32c2.js","/_astro/auth.ebabda63.js","/_astro/client.776ae22e.js","/_astro/web.f8ced1ee.js"]}), {
	pageMap,
	renderers,
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap };
