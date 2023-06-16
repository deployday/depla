import exp from 'constants';
import {
  convertAstroASTintoRekaAST,
  jsExpressionToReka,
  jsToReka,
  readProps,
  resetId,
} from './depla-ast';

describe('convert', () => {
  afterEach(() => {
    resetId();
  });
  it('simple Hello World!', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'frontmatter',
          value: '\n',
        },
        {
          type: 'element',
          name: 'div',
          attributes: [],
          children: [
            {
              type: 'text',
              value: 'Hello',
            },
          ],
        },
        { type: 'text', value: '\n' },
      ],
    };

    const rekaExpected = {
      variables: {
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
        {
          type: 'RekaComponent',
          id: '3',
          name: 'index',
          meta: {},
          props: [],
          state: [],
          template: {
            type: 'TagTemplate',
            id: '1',
            meta: {},
            props: {},
            children: [
              {
                type: 'TagTemplate',
                id: '2',
                meta: {},
                props: {
                  value: {
                    type: 'Literal',
                    value: 'Hello',
                  },
                },
                children: [],
                tag: 'text',
                if: null,
                each: null,
                classList: null,
              },
            ],
            if: null,
            each: null,
            classList: null,
            tag: 'div',
          },
        },
      ],
      frame: {
        id: 'index',
        component: {
          name: 'index',
        },
      },
    };
    // Full Reducer
    // console.log(
    //   JSON.stringify(convertAstroASTintoRekaAST(ast, 'index'), null, 2)
    // );
    // expect(convertAstroASTintoRekaAST(ast, 'index')).toEqual(rekaExpected);
  });
  it('styles', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'frontmatter',
          value: '\n',
        },
        {
          type: 'element',
          name: 'style',
          attributes: [],
          children: [
            {
              type: 'text',
              value: '\n  body {\n    background: red;\n  }\n',
            },
          ],
        },
      ],
    };

    const rekaExpected = {
      variables: {
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
        {
          type: 'RekaComponent',
          id: '3',
          name: 'index',
          meta: {},
          props: [],
          state: [],
          template: {
            children: [],
            classList: null,
            each: null,
            id: '4',
            if: null,
            meta: {},
            props: {},
            tag: 'div',
            type: 'TagTemplate',
          },
        },
      ],
      frame: {
        id: 'index',
        component: {
          name: 'index',
        },
      },
      style: {
        type: 'TagTemplate',
        id: '1',
        meta: {},
        props: {},
        children: [
          {
            type: 'TagTemplate',
            id: '2',
            meta: {},
            props: {
              value: {
                type: 'Literal',
                value: '  body {    background: red;  }',
              },
            },
            children: [],
            tag: 'text',
            if: null,
            each: null,
            classList: null,
          },
        ],
        if: null,
        each: null,
        classList: null,
        tag: 'style',
      },
    };
    // Full Reducer
    // console.log(
    //   'EXPECTED',
    //   JSON.stringify(convertAstroASTintoRekaAST(ast, 'index'), null, 2)
    // );
    // expect(convertAstroASTintoRekaAST(ast, 'index')).toEqual(rekaExpected);
  });
  it('matches', async () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'frontmatter',
          value: `\n const foo = "bar";\n`,
        },
        {
          type: 'expression',
          children: [
            {
              type: 'text',
              value: '\n  items.map((item) => ( \n ',
            },
            {
              type: 'element',
              name: 'div',
              attributes: [],
              children: [
                {
                  type: 'text',
                  value: 'Item',
                },
              ],
            },
            {
              type: 'text',
              value: '\n  )) \n ',
            },
          ],
        },
      ],
    };

    const rekaExpected = {
      variables: {
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
        Astro: {
          url: 'asdad',
        },
      },
      script: undefined,
      style: undefined,
      components: [
        {
          type: 'RekaComponent',
          id: '6',
          name: 'index',
          meta: {},
          props: [],
          state: [],
          template: {
            children: [
              {
                children: [],
                classList: null,
                each: null,
                id: '4',
                if: null,
                meta: {},
                props: {
                  value: {
                    type: 'Literal',
                    value: 'Item',
                  },
                },
                tag: 'text',
                type: 'TagTemplate',
              },
            ],
            classList: null,
            each: {
              alias: {
                external: false,
                name: 'item',
                type: 'Identifier',
              },
              index: {
                external: false,
                name: 'i',
                type: 'Identifier',
              },
              iterator: {
                external: false,
                name: 'items',
                type: 'Identifier',
              },
              type: 'ElementEach',
            },
            id: '5',
            if: null,
            meta: {},
            props: {},
            tag: 'div',
            type: 'TagTemplate',
          },
        },
      ],
      frame: {
        id: 'index',
        component: {
          name: 'index',
        },
      },
    };
    // Full Reducer
    console.log(
      'EXPECTED',
      JSON.stringify(await convertAstroASTintoRekaAST(ast, 'index'), null, 2)
    );
    expect(await convertAstroASTintoRekaAST(ast, 'index')).toEqual(
      rekaExpected
    );
  });
});

describe('parser', () => {
  it('converts simple expression', () => {
    const expected = {
      elements: [
        {
          id: expect.any(String),
          meta: {},
          properties: {
            foo: {
              id: expect.any(String),
              meta: {},
              type: 'Literal',
              value: 'bar',
            },
          },
          type: 'ObjectExpression',
        },
      ],
      id: expect.any(String),
      meta: {},
      type: 'ArrayExpression',
    };
    expect(jsExpressionToReka(`[{ foo: 'bar'}]`)).toEqual(expected);
  });

  // it('converts array iteration', () => {
  //   const expected = {};
  //   expect(
  //     jsToReka(`
  //     <ul>{[1,2,3].map((item) => (<li>{item}</li>))}</ul>
  //     `)
  //   ).toEqual(expected);
  // });
  it('reads props', () => {
    const expected = ['title', 'age'];
    const props = readProps(`
      const foo = 'bar'
      export interface Props {
      title?: string
      age?: number
      }
      `);
    expect(props).toEqual(expected);
  });

  it('reads astro', () => {
    const expected = [];
    const snippet = `
component App() (
<div className="scroll-mt-16">
      {
        [1,2,3].map((subitem) => (
                  <h3><text value={subitem} /></h3>
        ))
      }
</div>
)
    `;
    try {
      jsToReka(snippet);
    } catch (e) {
      console.log(e);
    }
    // expect(jsToReka(snippet)).toEqual(expected);
  });
});
