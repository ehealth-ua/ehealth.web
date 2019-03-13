import { ITEMS_PER_PAGE } from "../constants/pagination";

const filteredLocationParams = (params = {}, skip) => {
  const { filter, first, last, before, after } = params;
  return {
    ...skip,
    first:
      !first && !last ? ITEMS_PER_PAGE[0] : first ? parseInt(first) : undefined,
    last: last ? parseInt(last) : undefined,
    before,
    after,
    filter
  };
};

export default filteredLocationParams;
