import * as path from 'node:path';
import mkdirp from 'mkdirp';
import * as crypto from 'crypto';
import * as fs from 'node:fs';
import {
  astroToReka,
  convertAstroASTintoRekaAST,
  extractVariablesFromTS,
  readProps,
} from './depla-ast.js';
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
const injectVariablesLogging = (id, source, propsVariables, stateVariables) => {
  if (!propsVariables) return source;
  const isCurrentComponentAPage = id.indexOf('/pages/') !== -1;

  const componentName = isCurrentComponentAPage
    ? 'Page'
    : `${path.basename(id, '.astro')}`;
  const templateId = id
    .replace(path.resolve(), '')
    .replaceAll('/', '')
    .replace('.astro', '');

  const editorDirPath = path.resolve('./.depla', 'editor', 'state');
  if (!fs.existsSync(editorDirPath)) {
    mkdirp.sync(editorDirPath);
  }

  const props = propsVariables
    ?.reduce((acc, curr) => (acc += `,'${curr}': ${curr}`), '')
    ?.slice(1);
  const state = stateVariables
    ?.reduce((acc, curr) => (acc += `,'${curr}': ${curr}`), '')
    ?.slice(1);
  const js =
    `
  const __EDITOR_uri = Astro2.url.pathname.replaceAll('/', '') || 'home';
  const __EDITOR_stateFilePath = '${editorDirPath}/' + __EDITOR_uri + '.json'
  ` +
    (isCurrentComponentAPage
      ? `
    const __EDITOR_state = {};
  `
      : `
    const __EDITOR_state = fs.existsSync(__EDITOR_stateFilePath)
      ? fromJSON(parse(fs.readFileSync(__EDITOR_stateFilePath, { encoding: 'utf8' })))
      : {};
  `) +
    `
    if (!Array.isArray(__EDITOR_state['${componentName}'])) {
      __EDITOR_state['${componentName}'] = []
    }
    __EDITOR_state['${componentName}'].push({
      templateId: '${templateId}',
      props: {${props}},
      state: {${state}}
    });
  fs.writeFileSync(__EDITOR_stateFilePath, stringify(toJSON(__EDITOR_state)));
`;

  // const js = '';

  return source
    .replace(
      /import \{/,
      `
      import * as fs from 'node:fs';
      import { parse, fromJSON, toJSON, stringify } from 'flatted';
      import {
      `
    )
    .replace('return ', js + '\nreturn ');
};

export const transformAstroToReka = async (source: string, id: string) => {
  if (id.indexOf('GlobalStyles') !== -1) return source;
  // console.log('=========MODUILE========' + id);
  const astroSource = fs.readFileSync(id, { encoding: 'utf8' });
  const templatePart = astroSource.split('---')[2]?.trim();
  let finalMarkup;
  if (templatePart?.slice(0, 5) === '<html') {
    finalMarkup = '<div><slot /></div>';
  } else {
    const jsxPart = templatePart.split(
      /(?:<style[^>]*>|<\/style>|<script[^>]*>|<\/script>)/gi
    );
    const jsxPartFiltered = jsxPart
      .filter((s) => s.trim().charAt(0) === '<')[0]
      .trim();
    finalMarkup =
      id.indexOf('/pages/') !== -1
        ? jsxPartFiltered
        : `<>${jsxPartFiltered}</>`;
  }

  const editorDirPath = path.resolve('./.depla', 'editor', 'components');
  if (!fs.existsSync(editorDirPath)) {
    mkdirp.sync(editorDirPath);
  }
  // const md5sum = crypto.createHash('md5');
  // md5sum.update(path);
  // const hash = md5sum.digest('hex').slice(0, 7);
  // const config = fs.existsSync(injectionsJSONPath)
  //   ? JSON.parse((await readFile(injectionsJSONPath)).toString())
  //   : {};

  // save to FS
  const templateId = id
    .replace(path.resolve(), '')
    .replaceAll('/', '')
    .replace('.astro', '');
  const rekaFileName = path.resolve(editorDirPath, `${templateId}.tsx`);
  fs.writeFileSync(rekaFileName, finalMarkup);

  const astroJS = astroSource.split('---')[1];
  const allVariables = extractVariablesFromTS(astroJS);
  const propsVariables = readProps(astroJS);
  const stateVariables = allVariables.filter(
    (variable) =>
      templatePart.match(new RegExp('{\\s*' + variable)) &&
      !['Editor', 'Cms', 'GlobalStyles'].includes(variable) &&
      !propsVariables.includes(variable)
  );

  // console.log('LIST OF VARIABLES', variables);
  const newSource = injectVariablesLogging(
    id,
    source,
    propsVariables,
    stateVariables
  );
  const str = `

  WRITING FOLLOWING SOURCE for ${id}
  ${newSource}

  `;
  return newSource;
  // }
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

  return source;
  // return render(handler.dom, {
  //   encodeEntities: false,
  // });
};
