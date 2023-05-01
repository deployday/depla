export const getAppByName = (name = 'website', config) => {
  const { apps } = config;
  for (let i = 0; i < apps.length; i++) {
    const app = {
      name: 'website',
      ...apps[i],
    };
    if (app.name === name) return app;
  }
};
