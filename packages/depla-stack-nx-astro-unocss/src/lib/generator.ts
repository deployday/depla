import * as os from 'os';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = (config = {}) => {
  return {
    runBefore: [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npm i @depla/utils-image @depla/utils-url @depla/utils-js-object`,
    ],
    runAfter: [
      `${VOLTA_BINARY} run --node ${NODE_VERSION} \
      npx --yes depla@latest`,
    ],
  };
};
// export const generate = (config: Config) => {
//   const commands = [
//     { func: workspace, params: { config } },
//     { func: packages, params: { config } },
//     { func: apps, params: { config } },
//     { func: integrations, params: { config } },
//     { func: libs, params: { config } },
//     { func: fonts, params: { config } },
//     { func: deplaJson, params: { config } },
//   ];
//   return generate(commands);
// };
