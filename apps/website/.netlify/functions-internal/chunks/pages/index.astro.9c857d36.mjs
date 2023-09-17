import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, f as renderComponent } from '../astro.4a7ce0d2.mjs';
import 'html-escaper';
import { $ as $$Layout } from './apps.astro.2fadd8d3.mjs';
/* empty css                           */import 'cookie';
import 'kleur/colors';
import '@astrojs/internal-helpers/path';
import 'path-to-regexp';
import 'mime';
import 'string-width';
/* empty css                          */
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
}, "/Users/sergey/code/deployday/depla/apps/website/src/components/Card.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "class": "astro-J7PV25F6" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<a class="btn astro-J7PV25F6" href="/apps">
    <span class="astro-J7PV25F6">Start</span>
  </a>
  <main class="astro-J7PV25F6">
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
}, "/Users/sergey/code/deployday/depla/apps/website/src/pages/index.astro", void 0);

const $$file = "/Users/sergey/code/deployday/depla/apps/website/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, prerender, $$url as url };
