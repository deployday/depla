// @ts-nocheck
export const prependAsyncCallbackToObjectMethods = (Foo, cb) => {
  // we iterate over all method names

  const methods = Object.getOwnPropertyNames(Foo).filter(
    (item) =>
      typeof Foo[item] === 'function' &&
      Foo[item].constructor.name === 'AsyncFunction'
  );

  methods.forEach((name) => {
    // First to do: we save the original method. Adding it to prototype
    // is a good idea, we keep 'method1' as '_method1' and so on
    Foo['_' + name] = Foo[name];

    // Next, we replace the original method with one that does the logging
    // before and after method execution.
    Foo[name] = async (...args) => {
      // all arguments that the method receives are in the 'arguments' object
      const { before, after } = cb.call(this, name);

      // now we call the original method, _method1, on this with all arguments we received
      // this is probably the most confusing line of code here ;)
      // (I never user this['method'] before - but it works)
      await before();
      const result = await Foo['_' + name].apply(Foo, args);
      await after();

      // here is the post-execution logging

      // and we need to return the original result of the method
      return result;
    };
  });

  const syncMethods = Object.getOwnPropertyNames(Foo).filter(
    (item) =>
      typeof Foo[item] === 'function' &&
      Foo[item].constructor.name !== 'AsyncFunction'
  );

  syncMethods.forEach((name) => {
    // First to do: we save the original method. Adding it to prototype
    // is a good idea, we keep 'method1' as '_method1' and so on
    Foo['_' + name] = Foo[name];

    // Next, we replace the original method with one that does the logging
    // before and after method execution.
    Foo[name] = async (...args) => {
      // all arguments that the method receives are in the 'arguments' object
      const { before, after } = cb.call(this, name);

      // now we call the original method, _method1, on this with all arguments we received
      // this is probably the most confusing line of code here ;)
      // (I never user this['method'] before - but it works)
      await before();
      const result = Foo['_' + name].apply(Foo, args);
      await after();

      // here is the post-execution logging

      // and we need to return the original result of the method
      return result;
    };
  });
};
