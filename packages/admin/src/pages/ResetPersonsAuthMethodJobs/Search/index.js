import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Box, Heading } from "@rebass/emotion";
import { Trans, DateFormat, Plural } from "@lingui/macro";
import differenceInSeconds from "date-fns/difference_in_seconds";

import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import { LocationParams } from "@ehealth/components";

import Link from "../../../components/Link";
import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import SearchForm from "../../../components/SearchForm";
import Pagination from "../../../components/Pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import { PrimarySearchFields } from "./SearchFields";

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Reset persons authentication method jobs</Trans>
    </Heading>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;
        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
            />
            <Query
              query={ResetPersonsAuthMethodJobsQuery}
              fetchPolicy="network-only"
              variables={{
                first:
                  !first && !last
                    ? ITEMS_PER_PAGE[0]
                    : first
                      ? parseInt(first)
                      : undefined,
                last: last ? parseInt(last) : undefined,
                after,
                before,
                orderBy,
                filter
              }}
            >
              {({
                loading,
                data: {
                  personsAuthResetJobs: {
                    nodes: personsAuthResetJobs = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(personsAuthResetJobs)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    <Table
                      data={personsAuthResetJobs}
                      header={{
                        databaseId: <Trans>ID</Trans>,
                        name: <Trans>Job name</Trans>,
                        startedAt: <Trans>Started at</Trans>,
                        executionTime: <Trans>Execution time</Trans>,
                        status: <Trans>Job status</Trans>,
                        details: <Trans>Details</Trans>
                      }}
                      renderRow={({
                        id,
                        databaseId,
                        status,
                        startedAt,
                        endedAt
                      }) => ({
                        databaseId,
                        name: (
                          <Trans>Reset persons authentication method</Trans>
                        ),
                        startedAt: (
                          <DateFormat
                            value={startedAt}
                            format={{
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric"
                            }}
                          />
                        ),
                        executionTime:
                          status === "PENDING" || (!endedAt || !startedAt) ? (
                            "-"
                          ) : (
                            <Plural
                              value={differenceInSeconds(endedAt, startedAt)}
                              zero="# seconds"
                              one="# second"
                              few="# seconds"
                              many="# seconds"
                              other="# seconds"
                            />
                          ),
                        status: (
                          <Badge type="JOBS" name={status} display="block" />
                        ),
                        details: (
                          <Link to={`../${id}`} fontWeight="bold">
                            <Trans>Show details</Trans>
                          </Link>
                        )
                      })}
                      sortableFields={["startedAt"]}
                      sortingParams={parseSortingParams(orderBy)}
                      onSortingChange={sortingParams =>
                        setLocationParams({
                          ...locationParams,
                          orderBy: stringifySortingParams(sortingParams)
                        })
                      }
                      tableName="persons-auth-reset-jobs/search"
                    />
                    <Pagination {...pageInfo} />
                  </LoadingOverlay>
                );
              }}
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

const ResetPersonsAuthMethodJobsQuery = gql`
  query ResetPersonsAuthMethodJobsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: PersonsAuthResetJobFilter
    $orderBy: PersonsAuthResetJobOrderBy
  ) {
    personsAuthResetJobs(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        id
        databaseId
        name
        status
        startedAt
        endedAt
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${Pagination.fragments.entry}
`;

export default Search;
