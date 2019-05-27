import React from "react";
import gql from "graphql-tag";
import { Flex } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

const ServicesTable = ({ services, locationParams, setLocationParams }) => (
  <Table
    data={services}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>Service name</Trans>,
      code: <Trans>Service code</Trans>,
      category: <Trans>Category</Trans>,
      isActive: <Trans>Status</Trans>,
      requestAllowed: <Trans>Is request allowed</Trans>,
      isComposition: <Trans>Is composition</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      updatedAt: <Trans>Updated at</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      insertedAt,
      updatedAt,
      isActive,
      requestAllowed,
      isComposition,
      ...serviceData
    }) => ({
      ...serviceData,
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
          type="ACTIVE_STATUS_M"
          name={isActive}
          variant={!isActive}
          display="block"
        />
      ),
      requestAllowed: <StatusIcon status={requestAllowed} />,
      isComposition: <StatusIcon status={isComposition} />,
      details: (
        <Link to={`../${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={["name", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="updatedAt"
    tableName="services-table/search"
  />
);

const StatusIcon = ({ status }) => (
  <Flex justifyContent="center">
    {status ? <PositiveIcon /> : <NegativeIcon />}
  </Flex>
);

ServicesTable.fragments = {
  entry: gql`
    fragment Service on Service {
      id
      databaseId
      name
      code
      category
      insertedAt
      updatedAt
      isActive
      requestAllowed
      isComposition
    }
  `
};

export default ServicesTable;
