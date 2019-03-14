import { ITEMS_PER_PAGE } from "../constants/pagination";

const resetPaginationParams = ({ first }: {}) => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});

export default resetPaginationParams;
