//@flow
import * as React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { INNM } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

const INNMsTable = ({
  innms,
  locationParams,
  setLocationParams,
  tableName = "INNMs/search"
}: {
  innms: Array<INNM>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp,
  tableName: string
}) => (
  <Table
    data={innms}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>INNM</Trans>,
      nameOriginal: <Trans>INNM original name</Trans>,
      sctid: <Trans>SCTID</Trans>,
      isActive: <Trans>Status</Trans>,
      insertedAt: <Trans>Inserted at</Trans>
    }}
    renderRow={({ id, insertedAt, isActive, ...innm }) => ({
      ...innm,
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
      isActive: (
        <Badge
          type="ACTIVE_STATUS_F"
          name={isActive}
          variant={!isActive}
          display="block"
        />
      )
    })}
    sortableFields={["insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    tableName={tableName}
  />
);

INNMsTable.fragments = {
  entry: gql`
    fragment INNMs on INNM {
      id
      databaseId
      name
      sctid
      nameOriginal
      isActive
      insertedAt
    }
  `
};

export default INNMsTable;
