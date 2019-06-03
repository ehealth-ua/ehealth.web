//@flow

import React from "react";
import gql from "graphql-tag";
import { Flex } from "@rebass/emotion";
import { NegativeIcon } from "@ehealth/icons";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { CapitationContract } from "@ehealth-ua/schema";
import type {
  SetLocationParamsProp,
  URLSearchParams
} from "@ehealth/components";

import Badge from "../../../../components/Badge";
import Link from "../../../../components/Link";
import Table from "../../../../components/Table";
import FullName from "../../../../components/FullName";

const ContractTable = ({
  capitationContracts,
  locationParams,
  setLocationParams
}: {
  capitationContracts: Array<CapitationContract>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => (
  <Table
    data={capitationContracts}
    header={{
      databaseId: <Trans>ID</Trans>,
      contractNumber: <Trans>Contract Number</Trans>,
      edrpou: <Trans>EDRPOU</Trans>,
      name: <Trans>Name of medical institution</Trans>,
      nhsSignerName: <Trans>Performer</Trans>,
      startDate: <Trans>The contract is valid with</Trans>,
      endDate: <Trans>The contract is valid for</Trans>,
      isSuspended: <Trans>Contract state</Trans>,
      insertedAt: <Trans>Added</Trans>,
      status: <Trans>Status</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      status,
      isSuspended,
      startDate,
      endDate,
      assigneeName,
      contractorLegalEntity: { edrpou, name },
      insertedAt,
      nhsSigner,
      ...capitationContracts
    }) => ({
      ...capitationContracts,
      edrpou,
      name,
      nhsSignerName: nhsSigner && <FullName party={nhsSigner.party} />,
      isSuspended: (
        <Flex justifyContent="center">
          <NegativeIcon
            fill={!isSuspended ? "#1BB934" : "#ED1C24"}
            stroke={!isSuspended ? "#1BB934" : "#ED1C24"}
          />
        </Flex>
      ),
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
      status: <Badge type="CONTRACT" name={status} display="block" />,
      details: (
        <Link to={`./${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={[
      "status",
      "startDate",
      "endDate",
      "isSuspended",
      "contractorLegalEntityEdrpou",
      "insertedAt"
    ]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    tableName="contract/search"
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="insertedAt"
  />
);

ContractTable.fragments = {
  entry: gql`
    fragment CapitationContracts on CapitationContract {
      id
      databaseId
      isSuspended
      contractNumber
      contractRequestId
      startDate
      endDate
      status
      insertedAt
      nhsSigner {
        id
        party {
          id
          ...FullName
        }
      }
      contractorLegalEntity {
        id
        edrpou
        name
      }
      contractorOwner {
        id
      }
    }
    ${FullName.fragments.entry}
  `
};

export default ContractTable;
