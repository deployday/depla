function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const CustomComponents = (function () {
  const components = {};
  return {
    get: function () {
      console.log('requested components ', components);
      return components;
    },
    set: function (name) {
      if (components.hasOwnProperty(name)) return;
      console.log('SETTTING ', name);
      components[name] = {
        type: 'RekaComponent',
        id: makeid(5),
        meta: {},
        name: name,
        template: {
          type: 'TagTemplate',
          id: makeid(5),
          meta: {},
          props: {
            class: {
              type: 'Literal',
              id: makeid(5),
              meta: {},
              value: 'bg-neutral-100 w-full h-full',
            },
          },
          children: [
            {
              type: 'SlotTemplate',
              id: makeid(5),
              meta: {},
              props: {},
              children: [],
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
        state: [],
        props: [],
      };
    },
  };
})();

const getProps = (attributes = []) => {
  const rekaAst = { props: {} };
  attributes.forEach((attribute: any) => {
    if (attribute.kind === 'expression') {
      if (attribute.name.indexOf('class') !== -1) {
        rekaAst.props['class'] = {
          type: 'Literal',
          value: [
            ...(rekaAst.props?.['class']?.split(' ') || []),
            attribute.value.replace(/[\n'"]+/g, ''),
          ].join(' '),
        };
      } else {
        rekaAst.props[attribute.name] = {
          type: 'Literal',
          // cut the '' from foo="'value'"
          value: attribute.value.replace(/[\n'"]+/g, ''),
        };
      }
    }
  });
  return rekaAst.props;
};

export const convertAst = (astroAst: any, name = '') => {
  if (astroAst.type === 'root') {
    console.log(JSON.stringify(astroAst.children, null, 2));
    return [
      {
        type: 'RekaComponent',
        id: makeid(5),
        name,
        meta: {},
        props: [],
        state: [],
        template: astroAst.children
          .map(convertAst)
          .filter((node: any) => !!node)[0],
      },
      function () {
        return Object.entries(CustomComponents.get()).map((e) => e[1]);
      },
    ];
  }

  if (astroAst.type === 'fragment') {
    CustomComponents.set(astroAst.name);
    const rekaAst: any = {
      type: 'ComponentTemplate',
      id: makeid(5),
      meta: {},
      props: {},
      children: astroAst.children.map(convertAst).filter((node: any) => !!node),
      component: {
        type: 'Identifier',
        id: makeid(5),
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

  if (astroAst.type === 'component') {
    CustomComponents.set(astroAst.name);
    const rekaAst: any = {
      type: 'ComponentTemplate',
      id: makeid(5),
      meta: {},
      props: {},
      children: astroAst.children.map(convertAst).filter((node: any) => !!node),
      component: {
        type: 'Identifier',
        id: makeid(5),
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

  if (astroAst.type === 'element') {
    if (astroAst.name === 'br') return null;
    const rekaAst: any = {
      type: 'TagTemplate',
      id: makeid(5),
      meta: {},
      props: {},
      children: astroAst.children.map(convertAst).filter((node: any) => !!node),
      if: null,
      each: null,
      classList: null,
      tag: astroAst.name,
    };

    rekaAst.props = { ...rekaAst.props, ...getProps(astroAst.attributes) };

    return rekaAst;
  }

  if (astroAst.type === 'text') {
    return astroAst.value.trim()
      ? {
          type: 'TagTemplate',
          id: makeid(5),
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
    const ifCondition = astroAst.children[0].value.match(
      /[\s\n]*([^&&\.]+)\.([^&&\s]+)\s*([^&&\s]+)\s*([^&&\s])\s*&&/
    );
    const eachCondition = astroAst.children[0].value.match(
      /[\s\n]*([^.]+)\.map\(\((.*)\)/
    );
    if (ifCondition && astroAst.children[1]) {
      const rekaAst: any = {
        type: 'TagTemplate',
        id: makeid(5),
        meta: {},
        props: getProps(astroAst.children[1].attributes || []),
        children: astroAst.children[1].children
          .map(convertAst)
          .filter((node: any) => !!node),
        if: null,
        each: null,
        classList: null,
        tag: astroAst.children[1].name,
      };
      rekaAst.if = {
        type: 'BinaryExpression',
        left: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: ifCondition[1],
            external: false,
          },
          property: {
            type: 'Identifier',
            name: ifCondition[2],
            external: false,
          },
        },
        operator: ifCondition[3],
        right: {
          type: 'Literal',
          value: ifCondition[4],
        },
      };
      return rekaAst;
    } else if (eachCondition && astroAst.children[1]) {
      const rekaAst: any = {
        type: 'TagTemplate',
        id: makeid(5),
        meta: {},
        props: getProps(astroAst.children[1].attributes || []),
        children: astroAst.children[1].children
          .map(convertAst)
          .filter((node: any) => !!node),
        if: null,
        each: null,
        classList: null,
        tag: astroAst.children[1].name,
      };
      rekaAst.each = {
        type: 'ElementEach',
        iterator: {
          type: 'Identifier',
          name: eachCondition[1],
          external: false,
        },
        alias: {
          type: 'Identifier',
          name: eachCondition[2],
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
      return value
        ? {
            type: 'TagTemplate',
            id: makeid(5),
            meta: {},
            props: {
              value: {
                type: 'MemberExpression',
                id: makeid(5),
                meta: {},
                object: {
                  type: 'Identifier',
                  id: makeid(5),
                  meta: {},
                  name: objName,
                  external: false,
                },
                property: {
                  type: 'Identifier',
                  id: makeid(5),
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
