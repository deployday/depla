import { Reka } from '@rekajs/core';
import { Parser, jsToReka as astToReka, parseWithAcorn } from '@rekajs/parser';
import * as TSParser from 'recast/parsers/typescript';
import * as b from '@babel/types';
import jscodeshift from 'jscodeshift';
import * as Acorn from 'acorn';
import * as recast from 'recast';
import walk from 'acorn-walk';
import * as tsPlugin from 'acorn-typescript';
import * as t from '@rekajs/types';
import { parse } from '@astrojs/compiler';
import * as fs from 'node:fs';
import { convert } from './attributes-to-props.js';

export const jsExpressionToReka = (source) => {
  const rekaAst = Parser.parseExpression(source);

  console.log('GOT FOLLOWING AST BY SOURCE', rekaAst, source);
  return rekaAst;
};

export const jsToReka = (source: string): b.Node => {
  const ast = parseWithAcorn(source, 0) as b.Node & Acorn.Node;
  // const rekaAst = astToReka(ast);

  console.log('GOT FOLLOWING AST PROGRAM BY SOURCE', ast, source);
  return ast;
};

export const readProps = (source) => {
  const props = [];
  // const acornAst = recast.parse(source, {
  //   parser: TSParser,
  // });
  // const acornAst = TSParser.parse(source, {
  //   sourceType: 'module',
  // });
  const acornAst = Acorn.Parser.extend(tsPlugin.tsPlugin()).parse(source, {
    sourceType: 'module',
    ecmaVersion: 'latest',
    locations: true,
  });
  console.log('ACOCCCCCCCOOORN', acornAst);
  jscodeshift(acornAst)
    .find(
      'TSInterfaceDeclaration',
      (node) => node.id.name.indexOf('Props') !== -1
    )
    .forEach(function (path) {
      path.node.body.body.forEach((node) => {
        // console.log(node.key.name);
        props.push(node.key.name);
      });
    });
  console.log('PRPRPRPRPRPRP', props);
  return props;

  // const types = recast.types;
  // const n = types.namedTypes;
  // const b = types.builders;
  // const acornAst = recast.parse(source, {
  //   parser: require('recast/parsers/typescript'),
  // });
  //
  // console.log('IOOIIOIOIOIO', acornAst);
  // recast.visit(acornAst, {
  //   visitTSInterfaceDeclaration(path) {
  //     console.log('INTERRRRR', path);
  //     this.traverse(path, {
  //       visitTSInterfaceBody(astPath) {
  //         // const { name } = astPath.node
  //         const props = astPath.node.body;
  //         props.forEach((prop) => {
  //           console.log('prop ', prop.typeAnnotation);
  //         });
  //         this.traverse(astPath);
  //       },
  //     });
  //   },
  // });
  // const ast = AcornParser.extend(tsPlugin()).parse(
  //   `
  //   const a = 1
  //   type A = number
  //   export {
  //       a,
  //       type A as B
  //     }
  //     `,
  //   {
  //     sourceType: 'module',
  //     ecmaVersion: 'latest',
  //     locations: true,
  //   }
  // );
  // fs.writeFileSync('/tmp/ast.json', JSON.stringify(ast, null, 2));
  // const node = ts.createSourceFile(
  //   'x.ts', // fileName
  //   fs.readFileSync('./my.component.ts', 'utf8'), // sourceText
  //   ts.ScriptTarget.Latest // langugeVersion
  // );
  // const ast = AcornParser.extend(tsPlugin()).parse(p, {
  //   sourceType: 'module',
  //   ecmaVersion: 'latest',
  //   locations: true,
  // });
  // const modules = [];
  // walk.simple(
  //   ast,
  //   {
  //     TypeMembers(node: any) {
  //       console.log('HERE', JSON.stringify(node));
  //     },
  //     // ImportDeclaration(node: any) {
  //     //   console.log('HERE', JSON.stringify(node.source.value));
  //     //   // modules.push([
  //     //   //   node.source.value,
  //     //   //   node.loc.start.line,
  //     //   //   node.loc.start.column,
  //     //   // ]);
  //     // },
  //     Literal(_node, _state, ancestors) {
  //       console.log('LITERARL: ', JSON.stringify(_node), _state, ancestors);
  //     },
  //     // modules.push([
  //     //   node.source.value,
  //     //   node.loc.start.line,
  //     //   node.loc.start.column,
  //     // ]);
  //     // },
  //   },
  //   {
  //     ...walk.base,
  //     type: () => {
  //       console.log('ASDASDASDAS');
  //     },
  //     interface: () => {
  //       console.log('QQQQQ');
  //     },
  //   }
  // );
  // console.log('WAAAAALK', modules);
  // walk.ancestor(ast, {
  //   Literal(_node, _state, ancestors) {
  //     console.log(
  //       "This literal's ancestors are:",
  //       ancestors?.map((n) => n.type)
  //     );
  //   },
  // });

  // console.log('GOT PROPS SRC', ast, source);
  // return ast;
};
// function makeid(length) {
//   let result = '';
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }
const makeidFactory = (def = 0) => {
  let counter = def || 0;
  const resetId = () => (counter = 0);
  return {
    makeid: (def = 0) => {
      counter++;
      return String(counter);
    },
    resetId,
  };
};
export const { makeid, resetId } = makeidFactory();

const getFilePathByComponentName = (componentName) => {
  if (componentName.indexOf('Layout') !== -1) {
    return `/Users/sergey/code/sergeylukin/libs/shared/ui/src/lib/layouts/${componentName}.astro`;
  }
  return `/Users/sergey/code/sergeylukin/libs/shared/ui/src/lib/${componentName}.astro`;
};

const getProps = (attributes = []) => {
  const rekaAst = { props: {} };
  attributes.forEach((attribute: any) => {
    if (attribute.name.indexOf(':') !== -1) return;
    const name =
      attribute.name === 'className'
        ? 'class'
        : convert(attribute.name.replace('-', ''));
    if (attribute.kind === 'expression') {
      if (name.indexOf('class') !== -1) {
        rekaAst.props[name] = {
          type: 'Literal',
          value: [
            ...(rekaAst.props?.[name]?.split(' ') || []),
            attribute.value.replace(/[\n'"]+/g, '').trim(),
          ].join(' '),
        };
      } else {
        rekaAst.props[name] = jsExpressionToReka(attribute.value.trim());
      }
    } else if (attribute.kind === 'quoted') {
      rekaAst.props[name] = {
        type: 'Literal',
        // cut the '' from foo="'value'"
        value: attribute.value.replace(/[\n'"]+/g, '').trim(),
      };
    }
  });
  return rekaAst.props;
};

const CustomComponents = (function () {
  const components = {};
  return {
    get: function () {
      // console.log('requested components ', components);
      return components;
    },
    set: async (name, convertAstroASTintoRekaAST) => {
      if (components.hasOwnProperty(name)) return;
      console.log('SETTTING ', name);
      const filePath = getFilePathByComponentName(name);

      const astro = ['VendorIcon', 'Editor', 'Studio'].includes(name)
        ? '<div>I</div>'
        : fs.readFileSync(filePath, { encoding: 'utf8' });
      const astroParsed = await parse(astro, {
        position: false, // defaults to `true`
      });
      console.log('ASTRO AST TREEJ', JSON.stringify(astroParsed.ast, null, 2));
      const astroAst = astroParsed.ast;

      const frontmatter =
        astroAst.children[0].type === 'frontmatter'
          ? astroAst.children[0].value
          : '';
      console.log('FRONTTTTTMATTTER', frontmatter, 'FRONTEND');
      const props = frontmatter ? readProps(frontmatter) : [];
      console.log('got PROPPPPPPRPRPRPRS', props);

      // console.log('PARSED ASTTTTTT', JSON.stringify(astroAST, null, 2));
      const rekaAST = await convertAstroASTintoRekaAST(
        astroParsed.ast,
        name,
        props
      );
      // console.log('GOT REKA', JSON.stringify(rekaAST, null, 2), name);
      const component = rekaAST.components[0];
      components[name] = component;
    },
  };
})();

export const convertAstroASTintoRekaAST = async (
  astroAst: any,
  name = '',
  props = []
) => {
  if (astroAst.type === 'root') {
    console.log('ROOOOOOT');
    const defaultTemplate = () => ({
      type: 'TagTemplate',
      id: makeid(),
      meta: {},
      props: {},
      children: [],
      if: null,
      each: null,
      classList: null,
      tag: 'div',
    });

    const allElements = await Promise.all(
      astroAst.children.map(convertAstroASTintoRekaAST)
    );

    // return {
    //   props,
    // };
    // }
    console.log('ALLELEM', props, astroAst.name);
    const templateElements = allElements.filter(
      (node: any) => !!node && node.tag
    );
    const template = templateElements.find(
      (el) => !new RegExp(['script', 'style'].join('|')).test(el.tag)
    );
    const style = templateElements.find((el) => el.tag === 'style');
    const script = templateElements.find((el) => el.tag === 'script');
    const RekaRoot = {
      type: 'RekaComponent',
      id: makeid(),
      name,
      meta: {},
      props: props.length
        ? props.map((propName) => ({
            type: 'ComponentProp',
            id: makeid(),
            meta: {},
            name: propName,
            init: null,
          }))
        : [],
      state: [],
      template: template || defaultTemplate(),
    };

    const ast = {
      variables: {
        Astro: {
          url: 'asdad',
        },
        posts: [
          {
            name: 'Interesting Post',
            image: '/images/pawel-olek-1.png',
            description:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          },
          {
            name: 'Hello World',
            image: '/images/pawel-olek-2.png',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
        ],
      },

      components: [
        RekaRoot,
        ...Object.entries(CustomComponents.get()).map((e) => e[1]),
      ],

      frame: {
        id: name,
        component: {
          name,
        },
      },

      style,
      script,
    };
    return ast;
    // console.log('MARIOOO', JSON.stringify(state), null, 3);

    // const reka = Reka.create();
    // reka.load(state);
    // reka.createFrame({
    //   id: 'index (/)',
    //   component: {
    //     name: 'index',
    //   },
    // });

    // const appComponent = reka.program;
    // console.log('AST', JSON.stringify(appComponent, null, 2));
    // const code = Parser.stringify(reka.program);
    // console.log('CODE', code);
    // const parsedCode = Parser.parseProgram(Parser.stringify(reka.program));
    // console.log('PARSED CODE', parsedCode);

    // return {
    //   style,
    //   script,
    //   html: RekaRoot,
    //   components: Object.entries(CustomComponents.get()).map((e) => e[1]),
    //   // state,
    // };
  }

  // if (astroAst.type === 'fragment') {
  //   await CustomComponents.set(astroAst.name, convertAstroASTintoRekaAST);
  //   const allElements = await Promise.all(
  //     astroAst.children.map(convertAstroASTintoRekaAST)
  //   );
  //   const templateElements = allElements.filter((node: any) => !!node);
  //   const rekaAst: any = {
  //     type: 'ComponentTemplate',
  //     id: makeid(),
  //     meta: {},
  //     props: {},
  //     children: templateElements,
  //     component: {
  //       type: 'Identifier',
  //       id: makeid(),
  //       meta: {},
  //       name: astroAst.name,
  //       external: false,
  //     },
  //     if: null,
  //     each: null,
  //     classList: null,
  //   };
  //
  //   rekaAst.props = { ...rekaAst.props, ...getProps(astroAst.attributes) };
  //
  //   return rekaAst;
  // }

  if (astroAst.type === 'component') {
    console.log('BEFORE SET', astroAst.name);
    await CustomComponents.set(astroAst.name, convertAstroASTintoRekaAST);
    console.log('AFTER SET');
    // console.log(CustomComponents.get());
    const allElements = await Promise.all(
      astroAst.children.map(convertAstroASTintoRekaAST)
    );
    // console.log(allElements);
    const templateElements = allElements.filter((node: any) => !!node);
    const rekaAst: any = {
      type: 'ComponentTemplate',
      id: makeid(),
      meta: {},
      props: {},
      children: templateElements,
      component: {
        type: 'Identifier',
        id: makeid(),
        meta: {},
        name: astroAst.name,
        external: false,
      },
      if: null,
      each: null,
      classList: null,
    };

    rekaAst.props = { ...rekaAst.props, ...getProps(astroAst.attributes) };

    return rekaAst;
  }

  if (astroAst.type === 'element' || astroAst.type === 'fragment') {
    // if (astroAst.name === 'br') return null;
    if (astroAst.name === 'slot') console.log('HEREE SLOTTTT', astroAst);
    const allElements = await Promise.all(
      astroAst.children.map(convertAstroASTintoRekaAST)
    );
    const templateElements = allElements.filter((node: any) => !!node);
    // const props = astroAst.attributes.reduce((acc, attr) => {
    //   const name = attr.name === 'class' ? 'className' : attr.name;
    //   acc[name] = {
    //     type: 'Literal',
    //     value: attr.value,
    //   };
    //   return acc;
    // }, {});
    const rekaAst: any = {
      type: astroAst.name === 'slot' ? 'SlotTemplate' : 'TagTemplate',
      id: makeid(),
      meta: {},
      props: getProps(astroAst.attributes),
      children: templateElements,
      if: null,
      each: null,
      classList: null,
      tag: astroAst.type === 'fragment' ? 'div' : astroAst.name,
    };

    return rekaAst;
  }

  if (astroAst.type === 'text') {
    return astroAst.value.trim()
      ? {
          type: 'TagTemplate',
          id: makeid(),
          meta: {},
          props: {
            value: {
              type: 'Literal',
              value: astroAst.value.replace(/[\n'"]+/g, ''),
            },
          },
          children: [],
          tag: 'text',
          if: null,
          each: null,
          classList: null,
          // tag: astroAst.name,
        }
      : null;
  }

  if (astroAst.type === 'expression') {
    // const ifCondition = astroAst.children[0].value.match(
    //   /[\s\n]*([^&&\.]+)\.([^&&\s]+)\s*([^&&\s]+)\s*([^&&\s])\s*&&/
    // );
    const ifCondition = astroAst.children[0].value.match(/(.+)\s+&&/);
    const eachCondition = astroAst.children[0].value.match(
      /(.*)\.map\(\(\{?([^\{\}]*)\}?\)/
    );
    console.log(eachCondition, 'ASDASDASDASDASD');
    if (ifCondition && astroAst.children[1]) {
      const allElements = await Promise.all(
        astroAst.children[1].children.map(convertAstroASTintoRekaAST)
      );
      const templateElements = allElements.filter((node: any) => !!node);
      const rekaAst: any = {
        type: 'TagTemplate',
        id: makeid(),
        meta: {},
        props: getProps(astroAst.children[1].attributes || []),
        children: templateElements,
        if: null,
        each: null,
        classList: null,
        tag: astroAst.children[1].name,
      };
      rekaAst.if = {
        type: 'Expression',
        value: ifCondition[1],
      };
      // rekaAst.if = {
      //   type: 'BinaryExpression',
      //   left: {
      //     type: 'MemberExpression',
      //     object: {
      //       type: 'Identifier',
      //       name: ifCondition[1],
      //       external: false,
      //     },
      //     property: {
      //       type: 'Identifier',
      //       name: ifCondition[2],
      //       external: false,
      //     },
      //   },
      //   operator: ifCondition[3],
      //   right: {
      //     type: 'Literal',
      //     value: ifCondition[4],
      //   },
      // };
      return rekaAst;
    } else if (eachCondition && astroAst.children[1]) {
      const allElements =
        astroAst?.children[1]?.children?.length > 0
          ? await Promise.all(
              astroAst?.children[1]?.children?.map(convertAstroASTintoRekaAST)
            )
          : [];
      const templateElements = allElements.filter((node: any) => !!node);
      const rekaAst: any = {
        type: 'TagTemplate',
        id: makeid(),
        meta: {},
        props: getProps(astroAst.children[1].attributes || []),
        children: templateElements,
        if: null,
        each: null,
        classList: null,
        tag: astroAst.children[1].name,
      };
      rekaAst.each = {
        type: 'ElementEach',
        iterator: {
          type: 'Identifier',
          name: eachCondition[1].trim(),
          external: false,
        },
        alias: {
          type: 'Identifier',
          name: eachCondition[2].trim(),
          external: false,
        },
        index: {
          type: 'Identifier',
          name: 'i',
          external: false,
        },
      };
      return rekaAst;
    } else {
      const value = astroAst.children[0].value
        .replace(/[\n'"]+/g, '')
        .trim()
        .split('.');
      const objName = value[0];
      const propertyName = value?.[1] || '';

      if (objName === '(title || subtitle || highlight) && (') {
        console.log('HHHHHHH', JSON.stringify(astroAst, null, 2));
      }
      return value
        ? {
            type: 'TagTemplate',
            id: makeid(),
            meta: {},
            props: {
              value: {
                type: 'MemberExpression',
                id: makeid(),
                meta: {},
                object: {
                  type: 'Identifier',
                  id: makeid(),
                  meta: {},
                  name: objName,
                  external: false,
                },
                property: {
                  type: 'Identifier',
                  id: makeid(),
                  meta: {},
                  name: propertyName,
                  external: false,
                },
              },
            },
            children: [],
            tag: 'text',
            if: null,
            each: null,
            classList: null,
          }
        : null;
    }
  }

  return null;
};
