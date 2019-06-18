//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { LocationParams } from "@ehealth/components";

import type { Task, PageInfo, Scalars } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Tabs from "../../components/Tabs";
import Badge from "../../components/Badge";
import EmptyData from "../../components/EmptyData";
import Pagination from "../../components/Pagination";
import TasksTable from "../../components/TasksTable";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingOverlay from "../../components/LoadingOverlay";
import DefinitionListView from "../../components/DefinitionListView";
import filteredLocationParams from "../../helpers/filteredLocationParams";

const Details = ({ id }: { id?: Scalars.ID }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => (
      <Query
        query={ResetPersonsAuthMethodJobQuery}
        variables={{ id, ...filteredLocationParams(locationParams) }}
      >
        {({ loading, data: { personsAuthResetJob } }) => {
          if (isEmpty(personsAuthResetJob)) return null;
          const { databaseId, status, tasks } = personsAuthResetJob;
          return (
            <LoadingOverlay loading={loading}>
              <Box p={6}>
                <Box py={10}>
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item to="/reset-persons-auth-method-jobs">
                      <Trans>Reset persons authentication method</Trans>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                      <Trans>Job details</Trans>
                    </Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Job ID</Trans>,
                    status: <Trans>Status</Trans>
                  }}
                  data={{
                    databaseId,
                    status: <Badge type="JOBS" name={status} minWidth={100} />
                  }}
                  color="#7F8FA4"
                  labelWidth="140px"
                />
              </Box>
              <Tabs.Nav>
                <Tabs.NavItem to="./">
                  <Trans>Job details</Trans>
                </Tabs.NavItem>
              </Tabs.Nav>
              <Tabs.Content>
                <Router>
                  <Tasks
                    path="/"
                    tasks={tasks}
                    locationParams={locationParams}
                    setLocationParams={setLocationParams}
                  />
                </Router>
              </Tabs.Content>
            </LoadingOverlay>
          );
        }}
      </Query>
    )}
  </LocationParams>
);

const Tasks = ({
  tasks,
  locationParams,
  setLocationParams
}: {
  tasks: { nodes: Array<Task>, pageInfo: PageInfo },
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp
}) => {
  const { nodes, pageInfo } = tasks || {};
  if (isEmpty(nodes)) return <EmptyData />;

  return (
    <>
      <TasksTable
        tasks={nodes}
        locationParams={locationParams}
        setLocationParams={setLocationParams}
        tableName="reset-persons-auth-method-jobs-table/tasks"
      />
      <Pagination {...pageInfo} />
    </>
  );
};

const ResetPersonsAuthMethodJobQuery = gql`
  query ResetPersonsAuthMethodJobQuery(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: TaskFilter
    $orderBy: TaskOrderBy
  ) {
    personsAuthResetJob(id: $id) {
      databaseId
      status
      tasks(
        first: $first
        last: $last
        before: $before
        after: $after
        filter: $filter
        orderBy: $orderBy
      ) {
        nodes {
          ...JobTasks
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${TasksTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Details;
