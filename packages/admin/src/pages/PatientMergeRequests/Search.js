import React from "react";
import { isEqual } from "lodash";
import { Flex, Box, Text, Heading } from "@rebass/emotion";
import { Query, Mutation } from "react-apollo";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Form, LocationParams } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Link from "../../components/Link";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import LoadingOverlay from "../../components/LoadingOverlay";

import STATUSES from "../../helpers/statuses";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const PatientMergeRequestsQuery = loader(
  "../../graphql/PatientMergeRequestsQuery.graphql"
);
const AssignMergeCandidate = loader(
  "../../graphql/AssignMergeCandidateMutation.graphql"
);

//TODO: we need to get the limit value from BE
const POSTPONED_REQUESTS_LIMIT = 4;

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;

        return (
          <Query
            query={PatientMergeRequestsQuery}
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
            {({ loading, error, data }) => {
              if (error) return null;
              const {
                mergeRequests: { nodes: mergeRequests = [], pageInfo = {} } = {}
              } = data || {};

              return (
                <LoadingOverlay loading={loading}>
                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={5}
                  >
                    <Box>
                      <Heading as="h1" fontWeight="normal" mb={4}>
                        <Trans>Patients Merge</Trans>
                      </Heading>
                      <Text fontSize={1}>
                        <Trans>
                          Choose a pending request or get the new one to get
                          started
                        </Trans>
                      </Text>
                    </Box>
                    <Mutation
                      mutation={AssignMergeCandidate}
                      refetchQueries={() => [
                        {
                          query: PatientMergeRequestsQuery
                        }
                      ]}
                    >
                      {assignMergeCandidate => (
                        <Button
                          onClick={async () => {
                            await assignMergeCandidate();
                          }}
                          variant="blue"
                          disabled={isRequestButtonDisabled(
                            mergeRequests,
                            POSTPONED_REQUESTS_LIMIT
                          )}
                        >
                          <Trans>Get the new Request</Trans>
                        </Button>
                      )}
                    </Mutation>
                  </Flex>
                  <SearchPatientMergeRequestsForm
                    initialValues={locationParams}
                    onSubmit={setLocationParams}
                  />
                  {mergeRequests.length > 0 && (
                    <>
                      <Table
                        data={
                          orderBy
                            ? mergeRequests
                            : sortMergeRequests(mergeRequests)
                        }
                        header={{
                          databaseId: <Trans>Merge Request ID</Trans>,
                          status: <Trans>Status</Trans>,
                          insertedAt: <Trans>Added</Trans>,
                          details: <Trans>Details</Trans>
                        }}
                        renderRow={({
                          id,
                          databaseId,
                          status,
                          insertedAt
                        }) => ({
                          databaseId,
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
                          status: (
                            <Badge
                              type="PATIENT_MERGE_REQUEST"
                              name={status}
                              display="block"
                            />
                          ),
                          details: (
                            <Link to={`../${id}`} fontWeight="bold">
                              <Trans>Show details</Trans>
                            </Link>
                          )
                        })}
                        sortableFields={["insertedAt"]}
                        sortingParams={parseSortingParams(
                          locationParams.orderBy
                        )}
                        onSortingChange={sortingParams =>
                          setLocationParams({
                            ...locationParams,
                            orderBy: stringifySortingParams(sortingParams)
                          })
                        }
                        tableName="PatientMergeRequests/search"
                        whiteSpaceNoWrap={["databaseId"]}
                      />
                      <Pagination {...pageInfo} />
                    </>
                  )}
                </LoadingOverlay>
              );
            }}
          </Query>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const SearchPatientMergeRequestsForm = ({ initialValues, onSubmit }) => {
  return (
    <Form onSubmit={() => null} initialValues={initialValues}>
      <Form.AutoSubmit
        onSubmit={params =>
          !isEqual(params.filter, initialValues.filter) &&
          onSubmit({
            ...params,
            ...resetPaginationParams(initialValues.first)
          })
        }
      />
      <Flex mx={-1}>
        <Box px={1} width={1 / 3}>
          <Trans
            id="Show all"
            render={({ translation }) => (
              <Field.Select
                name="filter.status"
                label={<Trans>Status</Trans>}
                items={Object.keys(STATUSES.PATIENT_MERGE_REQUEST)}
                itemToString={item =>
                  STATUSES.PATIENT_MERGE_REQUEST[item] || translation
                }
                emptyOption
                hideErrors
                variant="select"
              />
            )}
          />
        </Box>
      </Flex>
    </Form>
  );
};

const sortMergeRequests = mergeRequests =>
  mergeRequests.sort(request => (request.status === "NEW" ? -1 : 1));

const isRequestButtonDisabled = (mergeRequests, limit) => {
  const statusNew = mergeRequests.find(request => request.status === "NEW");
  const statusPostpone = mergeRequests.filter(
    request => request.status === "POSTPONE"
  );

  return statusNew || statusPostpone.length >= POSTPONED_REQUESTS_LIMIT;
};

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});
