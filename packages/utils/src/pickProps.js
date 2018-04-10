const pickProps = (object, whitelist) =>
  Object.entries(object).reduce(
    ([selected, rejected], [key, value]) =>
      whitelist.includes(key)
        ? [{ ...selected, [key]: value }, rejected]
        : [selected, { ...rejected, [key]: value }],
    [{}, {}]
  );

export default pickProps;
