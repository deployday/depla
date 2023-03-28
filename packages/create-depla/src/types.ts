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
  model: string;
  modelPlural: string;
}

export interface Command {
  func: Function;
  params: {};
}
