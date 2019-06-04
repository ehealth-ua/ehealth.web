//@flow
import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { Task } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Badge from "./Badge";
import Table from "./Table";

const LegalEntityJobTasksTable = ({
  tasks,
  locationParams,
  setLocationParams,
  tableName
}: {
  tasks: Array<Task>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp,
  tableName: string
}) => (
  <Table
    data={tasks}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>Name</Trans>,
      priority: <Trans>Priority</Trans>,
      status: <Trans>Status</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      updatedAt: <Trans>Updated at</Trans>,
      endedAt: <Trans>Ended at</Trans>
    }}
    renderRow={({
      insertedAt,
      updatedAt,
      status,
      requestAllowed,
      endedAt,
      ...taskData
    }) => ({
      ...taskData,
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
      endedAt: (
        <DateFormat
          value={endedAt}
          format={{
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }}
        />
      ),
      status: (
        <Badge type="MERGE_LEGAL_ENTITIES_JOBS" name={status} display="block" />
      )
    })}
    sortableFields={["status", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    hiddenFields="updatedAt,name"
    tableName={tableName}
  />
);

LegalEntityJobTasksTable.fragments = {
  entry: gql`
    fragment JobTasks on Task {
      id
      databaseId
      name
      priority
      status
      insertedAt
      endedAt
      updatedAt
    }
  `
};

export default LegalEntityJobTasksTable;
