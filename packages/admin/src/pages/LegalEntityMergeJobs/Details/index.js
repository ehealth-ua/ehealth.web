//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import { Router } from "@reach/router";
import { LocationParams } from "@ehealth/components";

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
        query={LegalEntityMergeJobQuery}
        variables={{ id, ...filteredLocationParams(locationParams) }}
      >
        {({ loading, error, data: { legalEntityMergeJob } }) => {
          if (isEmpty(legalEntityMergeJob)) return null;
          const {
            databaseId,
            mergedFromLegalEntity,
            mergedToLegalEntity,
            status,
            tasks
          } = legalEntityMergeJob;
          return (
            <LoadingOverlay loading={loading}>
              <Box p={6}>
                <Box py={10}>
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item to="/legal-entity-merge-jobs">
                      <Trans>Legal entity merge jobs</Trans>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                      <Trans>Job details</Trans>
                    </Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Job ID</Trans>,
                    mergedToLegalEntity: <Trans>Main legal entity name</Trans>,
                    mergedFromLegalEntity: (
                      <Trans>Related legal entity name</Trans>
                    ),
                    status: <Trans>Status</Trans>
                  }}
                  data={{
                    databaseId,
                    mergedToLegalEntity: mergedToLegalEntity.name,
                    mergedFromLegalEntity: mergedFromLegalEntity.name,
                    status: (
                      <Badge
                        type="MERGE_LEGAL_ENTITIES_JOBS"
                        name={status}
                        minWidth={100}
                      />
                    )
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

const Tasks = ({ tasks, locationParams, setLocationParams }) => {
  const { nodes, pageInfo } = tasks || {};
  if (isEmpty(nodes)) return <EmptyData />;

  return (
    <>
      <LegalEntityJobTasksTable
        tasks={nodes}
        locationParams={locationParams}
        setLocationParams={setLocationParams}
        tableName="legal-entity-merge-jobs-table/tasks"
      />
      <Pagination {...pageInfo} />
    </>
  );
};

const LegalEntityMergeJobQuery = gql`
  query LegalEntityMergeJobQuery(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: TaskFilter
    $orderBy: TaskOrderBy
  ) {
    legalEntityMergeJob(id: $id) {
      databaseId
      mergedFromLegalEntity {
        id
        name
      }
      mergedToLegalEntity {
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
