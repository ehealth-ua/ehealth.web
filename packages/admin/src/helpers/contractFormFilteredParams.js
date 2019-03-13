import isEmpty from "lodash/isEmpty";
import {
  formatDateTimeInterval,
  formatDateInterval,
  convertStringToBoolean
} from "@ehealth/utils";

import { CONTRACT_REQUEST_PATTERN } from "../constants/contractRequests";

const contractFormFilteredParams = filter => {
  if (!filter) return {};
  const {
    status,
    medicalProgram,
    legalEntityRelation = {},
    searchRequest,
    assignee,
    isSuspended,
    contractorLegalEntity,
    date: {
      startFrom,
      startTo,
      endFrom,
      endTo,
      insertedAtFrom,
      insertedAtTo
    } = {}
  } = filter;
  const contractNumberReg = new RegExp(CONTRACT_REQUEST_PATTERN);
  const contractNumberRegTest = contractNumberReg.test(searchRequest);
  const contract =
    !isEmpty(searchRequest) &&
    (!contractNumberRegTest
      ? { contractorLegalEntity: { edrpou: searchRequest } }
      : { contractNumber: searchRequest });
  return {
    startDate: formatDateInterval(startFrom, startTo),
    endDate: formatDateInterval(endFrom, endTo),
    insertedAt: formatDateTimeInterval(insertedAtFrom, insertedAtTo),
    status,
    contractorLegalEntity,
    legalEntityRelation: legalEntityRelation.name,
    assignee: !isEmpty(assignee)
      ? { databaseId: assignee.databaseId }
      : undefined,
    isSuspended: convertStringToBoolean(isSuspended),
    medicalProgram: !isEmpty(medicalProgram)
      ? { name: medicalProgram.name }
      : undefined,
    ...contract
  };
};

export default contractFormFilteredParams;
