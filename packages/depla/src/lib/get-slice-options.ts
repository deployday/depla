export const getSliceOptions = (
  sliceName = 'default',
  workspace = null,
  app = null
) => {
  const slices = app ? app.slices : workspace.slices;
  console.log('starting search ', sliceName);
  console.log('IN SLICES:', slices);
  const len = sliceName.length;
  let ret = {};
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    if (Array.isArray(slice)) {
      if (slice[0].substr(0, len) === sliceName && slice[1]) ret = slice[1];
    } else if (
      typeof slice === 'object' &&
      slice.name.substr(0, len) === sliceName
    ) {
      ret = slice;
    }
  }
  console.log('HOOORAY RET', ret);
  return ret;
};
