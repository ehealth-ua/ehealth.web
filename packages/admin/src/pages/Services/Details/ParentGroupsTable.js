import React from "react";
import gql from "graphql-tag";
import { Flex } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

const ParentGroupsTable = ({
  parentGroups,
  locationParams,
  setLocationParams
}) => (
  <Table
    data={parentGroups}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>Group name</Trans>,
      code: <Trans>Group code</Trans>,
      isActive: <Trans>Status</Trans>,
      requestAllowed: <Trans>Is request allowed</Trans>,
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
        <Link to={`/service-groups/${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={["name", "insertedAt", "code"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="updatedAt"
    tableName="services-parent-groups-table/search"
  />
);

ParentGroupsTable.fragments = {
  entry: gql`
    fragment ParentGroups on ServiceGroup {
      id
      databaseId
      name
      code
      isActive
      insertedAt
      updatedAt
      requestAllowed
    }
  `
};

export default ParentGroupsTable;
