//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { LocationParams } from "@ehealth/components";

import type { DocumentNode } from "graphql";
import type { Task, PageInfo } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Tabs from "../../../components/Tabs";
import Badge from "../../../components/Badge";
import EmptyData from "../../../components/EmptyData";
import Pagination from "../../../components/Pagination";
import Breadcrumbs from "../../../components/Breadcrumbs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import DefinitionListView from "../../../components/DefinitionListView";
import filteredLocationParams from "../../../helpers/filteredLocationParams";
import LegalEntityJobTasksTable from "../../../components/LegalEntityJobTasksTable";

const Details = ({ id }: { [string]: string }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => (
      <Query
        query={LegalEntityDeactivationJobQuery}
        variables={{ id, ...filteredLocationParams(locationParams) }}
      >
        {({ loading, error, data: { legalEntityDeactivationJob } }) => {
          if (isEmpty(legalEntityDeactivationJob)) return null;
          const {
            databaseId,
            deactivatedLegalEntity: { name },
            status,
            tasks
          } = legalEntityDeactivationJob;
          return (
            <LoadingOverlay loading={loading}>
              <Box p={6}>
                <Box py={10}>
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item to="/legal-entity-deactivate-jobs">
                      <Trans>Legal entity deactivate jobs</Trans>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                      <Trans>Job details</Trans>
                    </Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Job ID</Trans>,
                    name: <Trans>Legal entity</Trans>,
                    status: <Trans>Status</Trans>
                  }}
                  data={{
                    databaseId,
                    name,
                    status: (
                      <Badge
                        type="MERGE_LEGAL_ENTITIES_JOBS"
                        name={status}
                        minWidth={100}
                      />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="120px"
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
      <LegalEntityJobTasksTable
        tasks={nodes}
        locationParams={locationParams}
        setLocationParams={setLocationParams}
        tableName="legal-entity-deactivate-jobs-table/tasks"
      />
      <Pagination {...pageInfo} />
    </>
  );
};

const LegalEntityDeactivationJobQuery = gql`
  query LegalEntityDeactivationJobQuery(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: TaskFilter
    $orderBy: TaskOrderBy
  ) {
    legalEntityDeactivationJob(id: $id) {
      databaseId
      deactivatedLegalEntity {
        id
        name
      }
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
  ${LegalEntityJobTasksTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Details;
