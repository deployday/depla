const camelCase = (str) => str.substr(0, 1).toUpperCase() + str.substr(1);

export const getGlobalVars = (variables: any) => {
  return Object.keys(variables).map((name) => ({
    type: 'Val',
    id: 'l1FyvyHxdmWcI7DG2JmiC',
    meta: {},
    name,
    init: {
      type: 'CallExpression',
      id: 'eZPxOW9pzlhwltO8QV43H',
      meta: {},
      identifier: {
        type: 'Identifier',
        id: 'fOt7pvHXcDuUj1J2grp9X',
        meta: {},
        name: `get${camelCase(name)}`,
        external: true,
      },
      params: {},
    },
  }));
};
export const createSharedStateGlobals = (variables: any) => {
  const functions = (self) =>
    Object.keys(variables).reduce((acc, varName) => {
      acc[`get${camelCase(varName)}`] = () => {
        return self.getExternalState(varName);
      };
      return acc;
    }, {});
  return {
    extension: [],
    externals: {
      // components: [...(config.externals?.components ?? [])],
      states: {
        ...(variables ?? {}),
        ...{
          scrollTop: 0,
          myString: 'Hello from External Variable',
        },
      },
      functions: (self) => {
        return {
          ...{
            getScrollTop: () => {
              return self.getExternalState('scrollTop');
            },
          },
          ...(functions(self) || {}),
        };
      },
    },
  };
};
