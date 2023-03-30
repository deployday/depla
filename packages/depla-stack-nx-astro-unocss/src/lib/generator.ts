export const generate = () => {
  return 'HELLO from inside generator module';
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
