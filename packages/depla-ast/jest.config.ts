/* eslint-disable */
export default {
  displayName: 'ioc',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  "moduleNameMapper": {
        "^(\\.\\/.+)\\.js$": "$1"
      },
  coverageDirectory: '../../coverage/packages/ioc',
};
