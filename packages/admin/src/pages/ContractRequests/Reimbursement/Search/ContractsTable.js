// @flow

import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import type { ReimbursementContractRequest } from "@ehealth-ua/schema";
import type {
  SetLocationParamsProp,
  URLSearchParams
} from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import Badge from "../../../../components/Badge";
import Link from "../../../../components/Link";
import Table from "../../../../components/Table";
import FullName from "../../../../components/FullName";

const ContractTable = ({
  reimbursementContractRequests,
  locationParams,
  setLocationParams
}: {
  reimbursementContractRequests: Array<ReimbursementContractRequest>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => (
  <Table
    data={reimbursementContractRequests}
    header={{
      databaseId: <Trans>Contract request databaseID</Trans>,
      edrpou: <Trans>EDRPOU</Trans>,
      contractorLegalEntityName: <Trans>Name of medical institution</Trans>,
      contractNumber: <Trans>Contract Number</Trans>,
      startDate: <Trans>The contract is valid with</Trans>,
      endDate: <Trans>The contract is valid for</Trans>,
      assigneeName: <Trans>Performer</Trans>,
      medicalProgram: <Trans>Medical program</Trans>,
      insertedAt: <Trans>Added</Trans>,
      status: <Trans>Status</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      status,
      startDate,
      endDate,
      contractorLegalEntity: { edrpou, name: contractorLegalEntityName },
      assignee,
      insertedAt,
      medicalProgram,
      ...reimbursementContractRequests
    }) => ({
      ...reimbursementContractRequests,
      edrpou,
      contractorLegalEntityName,
      medicalProgram: medicalProgram && medicalProgram.name,
      startDate: <DateFormat value={startDate} />,
      endDate: <DateFormat value={endDate} />,
      insertedAt: (
        <DateFormat
          value={insertedAt}
          format={{
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }}
        />
      ),
      assigneeName: assignee ? getFullName(assignee.party) : undefined,
      status: <Badge type="CONTRACT_REQUEST" name={status} display="block" />,
      details: (
        <Link to={`./${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={["status", "startDate", "endDate", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    tableName="reimbursementContractRequests/search"
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="contractorLegalEntityName,insertedAt"
  />
);

ContractTable.fragments = {
  entry: gql`
    fragment ReimbursementContractRequests on ReimbursementContractRequest {
      id
      databaseId
      contractNumber
      startDate
      endDate
      status
      databaseId
      assignee {
        id
        party {
          id
          ...FullName
        }
      }
      insertedAt
      contractorLegalEntity {
        id
        edrpou
        name
        databaseId
      }
      contractorOwner {
        id
      }
      medicalProgram {
        id
        name
      }
    }
    ${FullName.fragments.entry}
  `
};

export default ContractTable;
