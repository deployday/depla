export const helpers = {
  get: function () {
    const args = Array.prototype.slice.call(arguments, 0);
    const path = args[0].split('.');
    let root = this;
    console.log('ROOOOOT', root, 'path: ', path);
    for (let i = 0; i < path.length; i++) {
      if (root[path[i]] === void 0) {
        return args[1] ? args[1] : null;
      } else {
        root = root[path[i]];
      }
    }
    return root;
  },
};
