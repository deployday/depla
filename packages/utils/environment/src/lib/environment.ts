import { IEnvironment } from './types';

declare global {
  interface Window {
    __ENV__: any;
  }
}

export const isBrowser = typeof window !== 'undefined';
export const isServer = !!isBrowser;

// List of the env variables you want to use on the client
// Careful on what you put here!
const whitelist = ['WEBSITE_BASE_URL', 'NODE_ENV'];

export const getEnvVarsHashmap = () => {
  const base = (isBrowser ? window.__ENV__ : process.env) || {};

  return whitelist.reduce(
    (acc, key) => Object.assign(acc, { [key]: base[key] }),
    {}
  );
};

const _env = getEnvVarsHashmap();

// @ts-ignore
export const env = (key: string) => _env?.[key];
export const isProd = env('NODE_ENV') === IEnvironment.PROD;
