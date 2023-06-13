import { convertAstroASTintoRekaAST, resetId } from './depla-ast';

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
    expect(convertAstroASTintoRekaAST(ast, 'index')).toEqual(rekaExpected);
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
    expect(convertAstroASTintoRekaAST(ast, 'index')).toEqual(rekaExpected);
  });
});
