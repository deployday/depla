type IServiceCallback = (context: Container) => any;
interface IService {
  [name: string]: IServiceCallback;
}

export class Container {
  services: IService;

  constructor() {
    this.services = {};
  }

  service(name: string, cb: IServiceCallback) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!Object.hasOwnProperty.call(this.services, name)) {
          this.services[name] = cb(this);
        }

        return this.services[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}
