// @flow

import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { CapitationContractRequest } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Badge from "../../../../components/Badge";
import Link from "../../../../components/Link";
import Table from "../../../../components/Table";
import FullName from "../../../../components/FullName";

const ContractTable = ({
  capitationContractRequests,
  locationParams,
  setLocationParams
}: {
  capitationContractRequests: Array<CapitationContractRequest>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => (
  <Table
    data={capitationContractRequests}
    header={{
      databaseId: <Trans>Contract request databaseID</Trans>,
      contractNumber: <Trans>Contract Number</Trans>,
      edrpou: <Trans>EDRPOU</Trans>,
      contractorLegalEntityName: <Trans>Name of medical institution</Trans>,
      assigneeName: <Trans>Performer</Trans>,
      status: <Trans>Status</Trans>,
      startDate: <Trans>The contract is valid with</Trans>,
      endDate: <Trans>The contract is valid for</Trans>,
      insertedAt: <Trans>Added</Trans>,
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
      ...capitationContractRequests
    }) => ({
      ...capitationContractRequests,
      edrpou,
      contractorLegalEntityName,
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
      assigneeName: assignee ? <FullName party={assignee.party} /> : undefined,
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
    tableName="capitationContractRequests/search"
    whiteSpaceNoWrap={["databaseId"]}
  />
);

ContractTable.fragments = {
  entry: gql`
    fragment CapitationContractRequests on CapitationContractRequest {
      id
      databaseId
      contractNumber
      startDate
      endDate
      status
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
    }
    ${FullName.fragments.entry}
  `
};

export default ContractTable;
