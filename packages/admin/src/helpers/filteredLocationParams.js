import { ITEMS_PER_PAGE } from "../constants/pagination";
import {
  formatDateTimeInterval,
  convertStringToBoolean,
  formatDateInterval
} from "@ehealth/utils";

const filteredLocationParams = (params = {}, skip) => {
  const { filter = {}, first, last, before, after, orderBy } = params;
  const {
    isActive,
    party,
    startDate: { from, to } = {},
    date: { insertedAtFrom, insertedAtTo } = {},
    employeeStatus,
    status,
    legalEntityId,
    ...restFilters
  } = filter;
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
      party: party
        ? {
            ...party,
            noTaxId: convertStringToBoolean(party.noTaxId)
          }
        : undefined,
      insertedAt: formatDateTimeInterval(insertedAtFrom, insertedAtTo),
      startDate: formatDateInterval(from, to),
      status: employeeStatus || status,
      legalEntityId: legalEntityId ? legalEntityId.id : undefined
    }
  };
};

export default filteredLocationParams;
