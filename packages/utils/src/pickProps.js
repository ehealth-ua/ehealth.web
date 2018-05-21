const pickProps = (object, whitelist) => {
  const filterFn = Array.isArray(whitelist)
    ? key => whitelist.includes(key)
    : whitelist;

  return Object.entries(object).reduce(
    ([selected, rejected], [key, value]) =>
      filterFn(key)
        ? [{ ...selected, [key]: value }, rejected]
        : [selected, { ...rejected, [key]: value }],
    [{}, {}]
  );
};

export default pickProps;
