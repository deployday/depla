import * as path from 'node:path';
import * as fs from 'node:fs';
import { astroToReka, convertAstroASTintoRekaAST } from './depla-ast.js';
import { parse } from '@astrojs/compiler';
// import type { TLocalTransformOptions } from './';

// import { transformJsValue } from './transformJsValue.js';

// import render from 'dom-serializer';

// const trimTextNodes = (dom: DomHandler['dom']) => {
//   for (let c of dom) {
//     if ((c as NodeWithChildren)?.children?.length) {
//       trimTextNodes((c as NodeWithChildren).children);
//     } else if (c.type === 'text') {
//       c.data = c.data.trim();
//     }
//   }
// };

export const transformAstroToReka = async (source: string, id: string) => {
  if (id.match(/pages([\/\-\w]+)\.astro$/)) {
    console.log('TRANSFORM', id);
    const filename = path.basename(id).split('.')[0];
    const filePath = `${id.replace('.astro', '')}-editor.json.ts`;
    const astroSource = fs.readFileSync(id, { encoding: 'utf8' });
    // const result = await parse(astro, {
    //   position: false, // defaults to `true`
    // });
    const { components, variables, source } = astroToReka(
      astroSource.split('---')[2]
    );
    const obj = {
      components,
      variables,
      source,
    };
    console.log('ASTRO AST TREEJ', JSON.stringify(obj, null, 2));

    // const json = await convertAstroASTintoRekaAST(
    //   result.ast,
    //   path.basename(id).split('.')[0]
    // );
    // const components = o[1]();
    // console.log('ASTRO AST TREE', json);
    // console.log('0 element: ', JSON.stringify([o[0], ...components], null, 2));
    console.log('UPDATEING', filePath);
    fs.writeFileSync(
      filePath,
      `
export async function get({params, request}) {
    return {
        body: JSON.stringify(${JSON.stringify(obj, null, 2)}, null, 2)
    };
}
`
    );
    // OPEN ORIGINAL .ASTRO FILE

    // CONVERT TO AST

    // WALK THROUGH

    // COLLECT VARIABLES

    // let {
    //   descriptor: { template, script, scriptSetup, styles },
    // } = sfcParse(code);

    // console.log(
    //   template.content.length,
    //   template.loc.end.offset - template.loc.start.offset,
    //   JSON.stringify(
    //     sfcParse(code),
    //     (key, value) => {
    //       if (["source", "content", "mappings", "ast", "sourcesContent"].includes(key))
    //         return "<<omitted>>";

    //       return value;
    //     },
    //     4
    //   )
    // );

    //skip sfc if there's no module styles
    // @todo let styleModuleName: string | boolean = s.module;
    // let styleModule = styles.find((s) => s.module);

    // if (!styleModule) {
    //   return;
    // }

    // let localNameGenerator = (name: string) =>
    //   nameGenerator(name, id, styleModule.content);

    // let transformedSfc = code;

    // let templateOffsetChange = 0;

    // if (template) {
    //   // undefined means html as well
    //   template.lang ??= 'html';
    //
    //   let transformedTemplate: string;
    //
    //   switch (template.lang) {
    //     case 'pug':
    //       {
    //         transformedTemplate = transformPug(
    //           template.content,
    //           {
    //             preservePrefix,
    //             localNameGenerator,
    //             module: scriptTransform ? false : '$style',
    //           },
    //           pugLocals
    //         );
    //       }
    //       break;
    //     case 'html':
    //       {
    //         transformedTemplate = transformHtml(template.content, {
    //           preservePrefix,
    //           localNameGenerator,
    //           module: scriptTransform ? false : '$style',
    //         });
    //       }
    //       break;
    //     default:
    //       console.warn(
    //         `[CSS Modules] Unsupported template language "${template.lang}"! Skipped`
    //       );
    //
    //       return;
    //   }
    //
    //   //#region correct template lines count to fix source maps (fix #2)
    //
    //   let templateLines =
    //     1 + template.loc.end.line - template.loc.start.line;
    //   let transformedTemplateLines =
    //     1 + (transformedTemplate.match(/\r?\n/g)?.length ?? 0);
    //
    //   // @todo @bug in node.js this doesn't work and count all \r and \n separately for some reason?
    //   // .match(/^/gm).length; so instead match \r\n
    //
    //   let templateLinesDifference =
    //     templateLines - transformedTemplateLines;
    //
    //   if (templateLinesDifference > 0)
    //     transformedTemplate += '\n'.repeat(templateLinesDifference);
    //   else
    //     console.warn(
    //       `[CSS Modules] Resulting <template> is longer than source!`
    //     );
    //
    //   //#endregion
    //
    //   templateOffsetChange =
    //     transformedTemplate.length - template.content.length;
    //
    //   // @note use slice as it's faster than replace
    //   transformedSfc =
    //     transformedSfc
    //       .slice(0, template.loc.start.offset) //
    //       .replace(`lang="${template.lang}"`, (sub: string) => {
    //         templateOffsetChange -= sub.length;
    //         return '';
    //       }) +
    //     transformedTemplate +
    //     transformedSfc.slice(template.loc.end.offset);
    // }

    // if (scriptTransform) {
    //   let scriptSetupOffsetChange = 0;
    //
    //   if (scriptSetup) {
    //     let transformedScriptSetup = transformScript(
    //       scriptSetup.content,
    //       localNameGenerator
    //     );
    //
    //     scriptSetupOffsetChange =
    //       transformedScriptSetup.length - scriptSetup.content.length;
    //
    //     let offset = template
    //       ? scriptSetup.loc.start.offset < template.loc.start.offset
    //         ? // if script setup before template
    //           0
    //         : //after template
    //           templateOffsetChange
    //       : 0;
    //
    //     transformedSfc =
    //       transformedSfc.slice(0, scriptSetup.loc.start.offset + offset) +
    //       transformedScriptSetup +
    //       transformedSfc.slice(scriptSetup.loc.end.offset + offset);
    //   }
    //
    //   if (script) {
    //     let transformedScript = transformScript(
    //       script.content,
    //       localNameGenerator
    //     );
    //
    //     let offset = 0;
    //
    //     // add offset caused by template transform
    //     offset += template
    //       ? script.loc.start.offset < template.loc.start.offset
    //         ? 0
    //         : templateOffsetChange
    //       : 0;
    //
    //     // add offset caused by script setup transform
    //     if (scriptSetup) {
    //       offset +=
    //         script.loc.start.offset < scriptSetup.loc.start.offset
    //           ? 0
    //           : scriptSetupOffsetChange;
    //     }
    //
    //     transformedSfc =
    //       transformedSfc.slice(0, script.loc.start.offset + offset) +
    //       transformedScript +
    //       transformedSfc.slice(script.loc.end.offset + offset);
    //   }
    // }

    // return transformedSfc;
    // console.log('================', id, 'going over following code', code);
  } else {
    // console.log(id);
  }
  // const handler = new DomHandler(null, null, ({ attribs }) => {
  //   for (let [key, value] of Object.entries(attribs)) {
  //     switch (key) {
  //       // static
  //       case 'class':
  //       case 'id':
  //         {
  //           // class is a single string "class1 class2"
  //           // split by whitespace and filter empty
  //           attribs[key] = value
  //             .split(/\s+/g)
  //             .filter((e) => e)
  //             .map((e) => {
  //               if (e.startsWith(preservePrefix)) {
  //                 return e.slice(preservePrefix.length);
  //               } else {
  //                 return localNameGenerator(e);
  //               }
  //             })
  //             .join(' ');
  //         }
  //         break;
  //
  //       // escaped dynamic
  //       case `:${preservePrefix}class`:
  //       case `:${preservePrefix}id`:
  //         {
  //           attribs[':' + key.slice(1 + preservePrefix.length)] = attribs[key];
  //           delete attribs[key];
  //         }
  //         break;
  //
  //       // escaped static
  //       case `${preservePrefix}class`:
  //       case `${preservePrefix}id`:
  //         {
  //           attribs[key.slice(preservePrefix.length)] = attribs[key];
  //           delete attribs[key];
  //         }
  //         break;
  //
  //       // dynamic
  //       case ':class':
  //       case ':id':
  //       case 'v-bind:class':
  //       case 'v-bind:id':
  //         {
  //           value = transformJsValue(value, {
  //             preservePrefix,
  //             localNameGenerator,
  //             module,
  //           });
  //
  //           attribs[key] = value.replace(/`|"/g, "'");
  //         }
  //         break;
  //     }
  //   }
  // });

  // const parser = new Parser(handler, {
  //   xmlMode: true,
  // });

  // parser.parseComplete(source);

  // remove whitespace between tags
  // trimTextNodes(handler.dom);

  return 'asda';
  // return render(handler.dom, {
  //   encodeEntities: false,
  // });
};
