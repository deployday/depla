export const getWorkspaceByName = (name = 'default', config) => {
  const { workspaces } = config;
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = {
      name: 'default',
      scope: '@' + (workspaces[i]?.name || 'default'),
      baseDir: './',
      ...workspaces[i],
    };
    if (workspace.name === name) return workspace;
  }
};
