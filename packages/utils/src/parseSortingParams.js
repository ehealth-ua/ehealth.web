import camelCase from "lodash/camelCase";

const parseSortingParams = orderBy => {
  if (!orderBy) return;

  const [name, order] = orderBy.split(/_(?=[^_]+$)/);

  return { name: camelCase(name), order };
};

export default parseSortingParams;
