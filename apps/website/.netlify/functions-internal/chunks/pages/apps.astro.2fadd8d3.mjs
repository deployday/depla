import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, e as renderSlot, f as renderComponent } from '../astro.4a7ce0d2.mjs';
import 'html-escaper';
/* empty css                          */
const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
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
}, "/Users/sergey/code/deployday/depla/apps/website/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro();
const $$Apps = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Apps;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Apps" }, { "default": ($$result2) => renderTemplate`
  ${renderComponent($$result2, "Apps", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "/Users/sergey/code/deployday/depla/apps/website/src/components/apps", "client:component-export": "default" })}
` })}`;
}, "/Users/sergey/code/deployday/depla/apps/website/src/pages/apps.astro", void 0);

const $$file = "/Users/sergey/code/deployday/depla/apps/website/src/pages/apps.astro";
const $$url = "/apps";

const apps = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Apps,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, apps as a };
