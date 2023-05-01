export const getAppByName = (name = 'website', apps) => {
  for (let i = 0; i < apps.length; i++) {
    const app = {
      name: 'website',
      ...apps[i],
    };
    if (app.name === name) return app;
  }
};
