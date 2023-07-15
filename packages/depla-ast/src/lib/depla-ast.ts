import { Reka } from '@depla/reka-core';
import {
  Parser,
  jsToReka as astToReka,
  parseExpressionWithAcornToRekaType,
  parseWithAcorn,
} from '@depla/reka-parser';
import * as TSParser from 'recast/parsers/typescript';
// import * as babelParser from 'recast/parsers/esprima;
import * as b from '@babel/types';
import * as babel from '@babel/parser';
import j from 'jscodeshift';
import * as Acorn from 'acorn';
import jsx from 'acorn-jsx';
import * as recast from 'recast';
import * as walk from 'acorn-walk';
import * as tsPlugin from 'acorn-typescript';
import { extend } from 'acorn-jsx-walk';
import * as t from '@depla/reka-types';
import { parse } from '@astrojs/compiler';
import * as fs from 'node:fs';
import { convert } from './attributes-to-props.js';
import transformAstroToReka from './codemod-transform-reka.js';

export const jsExpressionToReka = (source) => {
  const rekaAst = Parser.parseExpression(source);

  // console.log('GOT FOLLOWING AST BY SOURCE', rekaAst, source);
  return rekaAst;
};

export const jsToReka = (source: string) => {
  const ast = parseWithAcorn(source, 0) as b.Node;
  const rekaAst = astToReka(ast as any);

  // console.log('GOT FOLLOWING AST PROGRAM BY SOURCE', rekaAst, source);
  return rekaAst;
};

extend(walk.base);
export const astroToReka = (source: string) => {
  // const ast = parseExpressionWithAcornToRekaType(source, 0);
  try {
    // console.log('HERE WE GOOO', ast);
    // const c = transform1(
    //   { source: '' },
    //   { jscodeshift }
    // );
    const components = [];
    const res = transformAstroToReka(source);
    // const res1Ast = parseWithRecast(res1);
    // console.log('RES1AST', res);
    return res;
    // const res2 = transform1(ast, { jscodeshift });
    // console.log('RESSSQQ', res2);
    // return res2;
    // const ast2 = parseWithRecast(res1)
    // const c = transform1(ast2, {
    //   jscodeshift,
    // });
    // console.log(c);
    // return c;

    // const astS = Acorn.Parser.extend(jsx()).parse('1 + 1', {
    //   ecmaVersion: 'latest',
    // });
    // walk.full(
    //   ast,
    //   // {
    //   // JSXElement(node: any) {
    //   //   console.log('asdasdasd', node);
    //   // },
    //   // TypeMembers(node: any) {
    //   //   console.log('HERE', JSON.stringify(node));
    //   // },
    //   // },
    //   // @ts-ignore
    //   (node: any) => {
    //     switch (node.type) {
    //       case 'JSXElement':
    //         console.log('JSXXXXX');
    //         break;
    //       default:
    //         console.log(`There's a ${node.type} node`, node);
    //         break;
    //     }
    //     const reka = astToReka(node);
    //     console.log('REKA: ', reka);
    //   }
    //   // {
    //   //   ...walk.base,
    //   //   type: () => {
    //   //     console.log('ASDASDASDAS');
    //   //   },
    //   //   JSXElement: () => {},
    //   //   Identifier: () => {
    //   //     console.log('QQQQQ');
    //   //   },
    //   // }
    // );
  } catch (err) {
    console.log(err);
    if (!err.loc) return;
    const { line, column } = err.loc;
    const lines = source.split('\n');
    console.log('PRINTINGGGGG', source, lines);
    const errorMessage = `${err.message} Syntax error. Line: ${line}, Char: ${column} \n

    ${lines[line]}
    `;
    throw Error(errorMessage);
  }
};

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
export const extractVariablesFromTS = (source) => {
  const acornAst = Acorn.Parser.extend(tsPlugin.tsPlugin()).parse(source, {
    sourceType: 'module',
    ecmaVersion: 'latest',
    locations: true,
  });
  const variables = [];

  // https://astexplorer.net/#/gist/6268805aeaea30386c6a9611529af81e/e7a2a11cf3183ece5ffbd73a72d1508f7aa40f92
  j(acornAst)
    .find(j.Node)
    .forEach((path) => {
      if (j.ImportSpecifier.check(path.node)) {
        variables.push(path.node.imported.name);
        return;
      }
      if (j.VariableDeclaration.check(path.node)) {
        // console.log(path.node);
        if (path.node.declarations.length > 0) {
          path.node.declarations.forEach((decl) => {
            // [first, second] = myArr;
            if (j.ArrayPattern.check(decl.id)) {
              decl.id.elements.forEach((el) => {
                variables.push(el.name);
              });
            } else if (j.Identifier.check(decl.id)) {
              variables.push(decl.id.name);
            } else if (decl.id.properties) {
              decl.id.properties.forEach((prop) => {
                if (prop.value) {
                  if (j.AssignmentPattern.check(prop.value)) {
                    variables.push(prop.value.left.name);
                  } else {
                    variables.push(prop.value.name);
                  }
                } else {
                  variables.push(prop.key.name);
                }
              });
            }
          });
        }
        return;
      }
    });
  return variables;
};

export const readProps = (source) => {
  const variables = [];
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
  // console.log('ACOCCCCCCCOOORN', acornAst);
  j(acornAst)
    .find(j.Node)
    .forEach((path) => {
      if (j.VariableDeclaration.check(path.node)) {
        if (path.node.declarations.length > 0) {
          path.node.declarations.forEach((decl) => {
            if (
              j.MemberExpression.check(decl.init) &&
              j.Identifier.check(decl.init.object) &&
              decl.init.object.name === 'Astro' &&
              decl.init.property.name === 'props'
            ) {
              decl.id.properties.forEach((prop) => {
                if (prop.value) {
                  if (j.AssignmentPattern.check(prop.value)) {
                    variables.push(prop.value.left.name);
                  } else {
                    variables.push(prop.value.name);
                  }
                } else {
                  variables.push(prop.key.name);
                }
              });
            }
          });
        }
        return;
      }
    });
  return variables;
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
      // console.log('SETTTING ', name);
      const filePath = getFilePathByComponentName(name);

      const astro = ['VendorIcon', 'Editor', 'Studio', 'GlobalStyles'].includes(
        name
      )
        ? '<div></div>'
        : fs.readFileSync(filePath, { encoding: 'utf8' });
      const astroParsed = await parse(astro, {
        position: false, // defaults to `true`
      });
      // console.log('ASTRO AST TREEJ', JSON.stringify(astroParsed.ast, null, 2));
      const astroAst = astroParsed.ast;

      const frontmatter =
        astroAst.children[0].type === 'frontmatter'
          ? astroAst.children[0].value
          : '';
      // console.log('FRONTTTTTMATTTER', frontmatter, 'FRONTEND');
      const props = frontmatter ? readProps(frontmatter) : [];
      // console.log('got PROPPPPPPRPRPRPRS', props);

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
    // console.log('ROOOOOOT');
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
    // console.log('ALLELEM', props, astroAst.name);
    const templateElements = allElements.filter((node: any) => !!node);
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
    // console.log('BEFORE SET', astroAst.name);
    await CustomComponents.set(astroAst.name, convertAstroASTintoRekaAST);
    // console.log('AFTER SET');
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
    // console.log(eachCondition, 'ASDASDASDASDASD');
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
        // console.log('HHHHHHH', JSON.stringify(astroAst, null, 2));
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
