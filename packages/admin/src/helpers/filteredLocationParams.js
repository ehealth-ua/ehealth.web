import { ITEMS_PER_PAGE } from "../constants/pagination";
import { convertStringToBoolean } from "@ehealth/utils";

const filteredLocationParams = (params = {}, skip) => {
  const { filter = {}, first, last, before, after, orderBy } = params;
  const { isActive, noTaxId, ...restFilters } = filter;
  return {
    ...skip,
    first:
      !first && !last ? ITEMS_PER_PAGE[0] : first ? parseInt(first) : undefined,
    last: last ? parseInt(last) : undefined,
    before,
    after,
    orderBy,
    filter: {
      ...restFilters,
      isActive: convertStringToBoolean(isActive),
      noTaxId: convertStringToBoolean(noTaxId)
    }
  };
};

export default filteredLocationParams;
