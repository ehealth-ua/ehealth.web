import React from "react";
import gql from "graphql-tag";
import { Flex } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Link from "../../../components/Link";
import Price from "../../../components/Price";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

const ProgramServicesTable = ({
  programServices,
  locationParams,
  setLocationParams,
  tableName = "program-services-table/search"
}) => (
  <Table
    data={programServices}
    header={{
      databaseId: <Trans>ID</Trans>,
      medicalProgram: <Trans>Medical program</Trans>,
      service: <Trans>Service</Trans>,
      serviceGroup: <Trans>Service group</Trans>,
      consumerPrice: <Trans>Consumer price</Trans>,
      isActive: <Trans>Status</Trans>,
      requestAllowed: <Trans>Is request allowed</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      updatedAt: <Trans>Updated at</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      medicalProgram,
      service,
      serviceGroup,
      consumerPrice,
      isActive,
      requestAllowed,
      insertedAt,
      updatedAt,
      ...serviceGroupData
    }) => ({
      ...serviceGroupData,
      medicalProgram: medicalProgram && medicalProgram.name,
      service: service && service.name,
      serviceGroup: serviceGroup && serviceGroup.name,
      consumerPrice: <Price amount={consumerPrice} />,
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
      updatedAt: (
        <DateFormat
          value={updatedAt}
          format={{
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }}
        />
      ),
      isActive: (
        <Badge
          type="ACTIVE_STATUS_F"
          name={isActive}
          variant={!isActive}
          display="block"
        />
      ),
      requestAllowed: (
        <Flex justifyContent="center">
          {requestAllowed ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      details: (
        <Link to={`/program-services/${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={["consumerPrice", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="updatedAt"
    tableName={tableName}
  />
);

ProgramServicesTable.fragments = {
  entry: gql`
    fragment ProgramServices on ProgramService {
      id
      databaseId
      medicalProgram {
        id
        name
      }
      service {
        id
        name
      }
      serviceGroup {
        id
        name
      }
      consumerPrice
      isActive
      requestAllowed
      insertedAt
      updatedAt
    }
  `
};

export default ProgramServicesTable;
