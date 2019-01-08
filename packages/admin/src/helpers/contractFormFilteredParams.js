import isEmpty from "lodash/isEmpty";
import { formatDateTimeInterval } from "@ehealth/utils";

import { EDRPOU_PATTERN } from "../constants/contractRequests";

const contractFormFilteredParams = filter => {
  if (!filter) return {};
  const {
    status = {},
    medicalProgram,
    legalEntityRelation = {},
    searchRequest,
    assignee,
    isSuspended,
    date: { startFrom, startTo, endFrom, endTo } = {}
  } = filter;
  const edrpouReg = new RegExp(EDRPOU_PATTERN);
  const edrpouTest = edrpouReg.test(searchRequest);
  const contract =
    !isEmpty(searchRequest) &&
    (edrpouTest
      ? { contractorLegalEntity: { edrpou: searchRequest } }
      : { contractNumber: searchRequest });
  return {
    ...contract,
    startDate: formatDateTimeInterval(startFrom, startTo),
    endDate: formatDateTimeInterval(endFrom, endTo),
    status: status.key,
    legalEntityRelation: legalEntityRelation.name,
    assignee: !isEmpty(assignee)
      ? { databaseId: assignee.databaseId }
      : undefined,
    isSuspended: convertIsSuspendedItem(isSuspended),
    medicalProgram: !isEmpty(medicalProgram)
      ? { name: medicalProgram.name }
      : undefined
  };
};

const convertIsSuspendedItem = item => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return undefined;
  }
};

export default contractFormFilteredParams;
