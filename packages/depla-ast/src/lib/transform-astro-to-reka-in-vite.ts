import { Plugin } from 'vite';
import { transformAstroToReka } from './transform-astro-to-reka.js';

// interface TPluginOptions {
//   preservePrefix: string;
//   scopeBehaviour: CSSModulesOptions['scopeBehaviour'];
//   scriptTransform: boolean;
//
//   pugLocals: Record<string, any>;
//
//   // pug: {
//   //   locals?: Record<string, string>;
//   //   options: PugOptions;
//   // };
//   nameGenerator: Exclude<CSSModulesOptions['generateScopedName'], string>;
// }

// type TLocalNameGenerator = (name: string) => string;

// export interface TLocalTransformOptions {
//   preservePrefix: string;
//   localNameGenerator: TLocalNameGenerator;
//   module?: string | false;
// }

//@todo or switch to command === "build" ?
const dev = process.env.NODE_ENV !== 'production';
/**
 *
 * @param options object with optional properties:
 *
 * **`preservePrefix`** - string to use as a prefix for keeping the names raw, the prefix is removed in the resulting code
 *
 * **`scriptTransform`** - you can use `$useCssModule('className')` macro, which will be statically replaced in your script (if this flag is `true`) with the resulting CSS module name. It's recommended to enable this only for production to save processing time during the development
 *
 * **`nameGenerator`** - function returning a unique name for a unique input. It must maintain its internal state to return the same result for subsequent calls with identical input
 *
 * @returns Vite plugin object
 */
export const transformAstroToRekaInVite = (): Plugin => {
  // pugLocals.dev = dev;

  return {
    name: 'Astro to Reka',
    enforce: 'pre',
    buildStart: (param1) => {
      // console.log('UYAAAAAAY', param1);
    },
    async resolveId(source, importer, options) {
      if (source.match(/ndex\.astro$/)) {
        // console.log('HOORAY RESOLVE ID ASTRO', source, importer, options);
      }
      // if (source === POLYFILL_ID) {
      // It is important that side effects are always respected
      // for polyfills, otherwise using
      // "treeshake.moduleSideEffects: false" may prevent the
      // polyfill from being included.
      // console.log('RESOLVEI DDDDDD', source, importer, options);
      // return { id: POLYFILL_ID, moduleSideEffects: true };
      // },
    },
    // moduleParsed(source) {
    //   if (source.indexOf('index') !== -1)
    //     console.log('OKOKOKOKOK SERIOS', source);
    // },
    // configureServer(server) {
    //   server.middlewares.use((req, res, next) => {
    //     // console.log('OKOKOKOKOK SERIOS', res);
    //     // custom handle request...
    //     return next();
    //   });
    // },

    // patch config with css module options
    // this is called only once (or when config file changes)
    // config() {
    //   return {
    //     css: {
    //       modules: {
    //         scopeBehaviour,
    //         generateScopedName: nameGenerator,
    //       },
    //     },
    //   };
    // },

    // This code should create a JSON file in following format:
    // {
    //   "vars": {
    //     "posts": undefined | Post[]
    //   },
    //   "components": {
    //   "Hero1": undefined | HTML
    //   }
    // }
    //
    //

    async transform(code, id) {
      if (id.match(/^((?!node_modules).)*\.astro$/)) {
        const newCode = await transformAstroToReka(code, id);
        return newCode;
      }
      return code;
    },
  };
  // @todo satisfies Plugin;
};

// export {
//   plugin as default, //
//   plugin as cssm,
//   type TPluginOptions,
// };

// export {
//   prodNameGeneratorContext, //
//   devNameGeneratorContext,
// };

// export {
//   removeCssModulesChunk, //
//   type TRemoveCssModulesChunkOptions,
// } from './removeCssModulesChunk.js';
