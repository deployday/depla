import JSZip from 'jszip';

export interface Config {
  name: string;
  scope: string;
  packages?: IPackage[];
  fonts?: string[];
  apps?: IApp[];
  libs?: ILib[];
  integrations?: IIntegration[];
  entities?: IEntity[];
  detached?: {
    [key: string]: IEntity;
  };
}

interface IPackage {
  packageName: string;
  isDev?: boolean;
}

interface IIntegration {
  integrationName: string;
  afterCmd?: string;
}

interface IApp {
  appName: string;
  generatorName: string;
  flags?: string;
}

interface ILib {
  name: string;
  directory: string;
  generatorName: string;
  flags?: string;
}

export interface IEntity {
  ref: string;
  refs: string;
  model: string;
  models: string;
}

export interface Command {
  func: Function;
  params: {};
}

export interface ILayer {
  name: string;
  generator: Function;
}

export interface ITemplateGenerator {
  generate: Function;
}

export interface IInjection {
  workspaceName: string;
  appName: string;
  injectionName: string;
  injectionObject: any;
}

export interface IExpectedInjection {
  workspaceName: string;
  appName: string;
  filename: string;
  injectionName: string;
  contents?: string;
}

export interface IBlob {
  absolutePath: string;
  relativePath: string;
}

export interface IGenerateStack {
  runBefore: string[];
  runAfter: string[];
  zip: JSZip;
  blobs?: IBlob[];
  writingInjections: IInjection[];
  expectingInjections: IExpectedInjection[];
}

export interface IContext {
  workspace: any;
  app?: any;
}
