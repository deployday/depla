import path from 'node:path';
import * as os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const VOLTA_BINARY = `${os.homedir()}/.volta/bin/volta`;
const NODE_VERSION = '16.16.0';

export const generate = ({
  domain,
  workspace,
  app,
}: {
  domain: any;
  workspace: any;
  app: any;
}) => {
  const uiDirectoryPath = path.join(process.cwd(), `libs/shared/ui`);
  const uiGeneratedDirectoryPath = path.join(
    process.cwd(),
    `libs/shared/generated/ui`
  );
  const uiReactDirectoryPath = path.join(process.cwd(), `libs/shared/ui-react`);
  const libraryExists = fs.existsSync(uiDirectoryPath);
  if (libraryExists) console.log(chalk.green(`ui is already installed`));

  return {
    runBefore: !libraryExists
      ? [
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
          npm i \
            @depla/utils-time@latest \
            hast-util-sanitize@^4.1.0 \
            hast-util-to-jsx-runtime@^1.2.0 \
            @astrojs/image@0.15.1 \
            astro-icon@0.8.0 \
            @astrolib/analytics@0.3.0 \
            @astrolib/seo@0.3.0 \
            netlify-cms-app@2.15.72 \

            @radix-ui/react-accessible-icon@1.0.3 \
            @radix-ui/react-accordion@1.1.2 \
            @radix-ui/react-alert-dialog@1.0.4 \
            @radix-ui/react-aspect-ratio@1.0.3 \
            @radix-ui/react-avatar@1.0.3 \
            @radix-ui/react-checkbox@1.0.4 \
            @radix-ui/react-collapsible@1.0.3 \
            @radix-ui/react-context-menu@2.1.4 \
            @radix-ui/react-dialog@1.0.4 \
            @radix-ui/react-dropdown-menu@2.0.5 \
            @radix-ui/react-hover-card@1.0.6 \
            @radix-ui/react-label@2.0.2 \
            @radix-ui/react-menubar@1.0.3 \
            @radix-ui/react-navigation-menu@1.1.3 \
            @radix-ui/react-popover@1.0.6 \
            @radix-ui/react-progress@1.0.3 \
            @radix-ui/react-radio-group@1.1.3 \
            @radix-ui/react-scroll-area@1.0.4 \
            @radix-ui/react-select@1.2.2 \
            @radix-ui/react-separator@1.0.3 \
            @radix-ui/react-slider@1.1.2 \
            @radix-ui/react-slot@1.0.2 \
            @radix-ui/react-switch@1.0.3 \
            @radix-ui/react-tabs@1.0.4 \
            @radix-ui/react-toast@1.1.4 \
            @radix-ui/react-toggle@1.0.3 \
            @radix-ui/react-toggle-group@1.0.4 \
            @radix-ui/react-tooltip@1.0.6 \

            class-variance-authority@0.6.0 \
            clsx@1.2.1 \
            lucide-react@0.233.0 \
            react-day-picker@8.7.1 \
            tailwind-merge@1.12.0 \
            tailwindcss-animate@1.0.5
        `,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ui --directory=shared --importPath=${workspace.scope}/shared/ui \
         --unitTestRunner=none`,
          `rm -fr ${uiDirectoryPath}/src`,
          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ui --directory=shared/generated --importPath=${workspace.scope}/shared/generated/ui \
         --unitTestRunner=none`,
          `rm -fr ${uiGeneratedDirectoryPath}/src`,

          `${VOLTA_BINARY} run --node ${NODE_VERSION} \
        npx --yes nx g @nrwl/js:lib \
        ui-react --directory=shared --importPath=${workspace.scope}/shared/ui-react \
         --unitTestRunner=none`,
          `rm -fr ${uiReactDirectoryPath}/src`,
        ]
      : [],
    runAfter: [],
    writingInjections: {},
  };
};
