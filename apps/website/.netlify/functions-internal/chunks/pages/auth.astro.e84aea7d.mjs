import { c as createAstro, a as createComponent, r as renderTemplate, f as renderComponent } from '../astro.4a7ce0d2.mjs';
import 'html-escaper';
import { $ as $$Layout } from './apps.astro.2fadd8d3.mjs';
import 'cookie';
import 'kleur/colors';
import '@astrojs/internal-helpers/path';
import 'path-to-regexp';
import 'mime';
import 'string-width';
/* empty css                          */
const $$Astro = createAstro();
const $$Auth = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Auth;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Start" }, { "default": ($$result2) => renderTemplate`
  ${renderComponent($$result2, "Auth", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/Users/sergey/code/deployday/depla/apps/website/src/components/auth", "client:component-export": "default" })}
` })}`;
}, "/Users/sergey/code/deployday/depla/apps/website/src/pages/auth.astro", void 0);

const $$file = "/Users/sergey/code/deployday/depla/apps/website/src/pages/auth.astro";
const $$url = "/auth";

export { $$Auth as default, $$file as file, $$url as url };
