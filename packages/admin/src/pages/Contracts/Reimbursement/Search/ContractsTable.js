import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import Badge from "../../../../components/Badge";
import Link from "../../../../components/Link";
import Table from "../../../../components/Table";
import FullName from "../../../../components/FullName";
import { Flex } from "@rebass/emotion";
import { NegativeIcon } from "@ehealth/icons";

const ContractTable = ({
  reimbursementContracts,
  locationParams,
  setLocationParams
}) => (
  <Table
    data={reimbursementContracts}
    header={{
      databaseId: <Trans>ID</Trans>,
      edrpou: <Trans>EDRPOU</Trans>,
      name: <Trans>Name of medical institution</Trans>,
      nhsSignerName: <Trans>Performer</Trans>,
      contractNumber: <Trans>Contract Number</Trans>,
      startDate: <Trans>The contract is valid with</Trans>,
      endDate: <Trans>The contract is valid for</Trans>,
      medicalProgram: <Trans>Medical program</Trans>,
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
      contractorLegalEntity: { name, edrpou },
      insertedAt,
      nhsSigner,
      medicalProgram,
      ...reimbursementContracts
    }) => ({
      ...reimbursementContracts,
      edrpou,
      name,
      nhsSignerName: nhsSigner && <FullName party={nhsSigner.party} />,
      medicalProgram: medicalProgram && medicalProgram.name,
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
      "insertedAt"
    ]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    tableName="reimbursement-contract/search"
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="insertedAt"
  />
);

ContractTable.fragments = {
  entry: gql`
    fragment ReimbursementContracts on ReimbursementContract {
      id
      databaseId
      contractNumber
      startDate
      endDate
      status
      statusReason
      isSuspended
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
      medicalProgram {
        id
        name
      }
    }
    ${FullName.fragments.entry}
  `
};

export default ContractTable;
