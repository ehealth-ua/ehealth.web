const filterPropertiesByValue = (data, filter) => {
  const filterFn = (key, value, filter) => {
    if (value === filter) {
      return {};
    }
    if (Array.isArray(value)) {
      return {
        [key]: arrFilter(value, filter)
      };
    }
    if (typeof value === "object" && value !== null) {
      return {
        [key]: objFilter(value, filter)
      };
    }
    return { [key]: value };
  };

  const objFilter = (data, filter) =>
    Object.entries(data).reduce(
      (obj, [k, v]) => ({ ...obj, ...filterFn(k, v, filter) }),
      {}
    );

  const arrFilter = (data, filter) =>
    data.map(el => filterPropertiesByValue(el, filter));

  if (Array.isArray(data)) return arrFilter(data, filter);
  if (typeof data === "object" && data !== null) return objFilter(data, filter);
  return data;
};

export default filterPropertiesByValue;
