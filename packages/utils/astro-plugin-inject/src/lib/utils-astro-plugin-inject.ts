import * as fs from 'fs';

export const inject = ({ filePath }: { filePath: string }) => {
  return {
    name: '@depl/astrojs-inject',
    hooks: {
      'astro:config:setup': async ({
        injectScript,
      }: {
        injectScript: string;
      }) => {
        const CONFIG_LOAD_JS = fs.readFileSync(filePath).toString();
        // @ts-ignore
        injectScript('page-ssr', CONFIG_LOAD_JS);
      },
    },
  };
};
