import React from "react";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import differenceInSeconds from "date-fns/difference_in_seconds";
import { loader } from "graphql.macro";
import { Trans, DateFormat, Plural } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";

import { Form, Validation, LocationParams } from "@ehealth/components";
import { SearchIcon, RemoveItemIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button, { IconButton } from "../../components/Button";
import * as Field from "../../components/Field";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import { EDRPOU_PATTERN } from "../../constants/legalEntitySearchPatterns";
import STATUSES from "../../helpers/statuses";

const LegalEntitiesDeactivationJobsQuery = loader(
  "../../graphql/LegalEntitiesDeactivationJobsQuery.graphql"
);

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Legal entity deactivate jobs</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;

        return (
          <>
            <SearchLegalEntitiesForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={LegalEntitiesDeactivationJobsQuery}
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
                if (error || isEmpty(data)) return null;
                const {
                  nodes: legalEntityDeactivationJobs = [],
                  pageInfo
                } = data.legalEntityDeactivationJobs;

                return (
                  <LoadingOverlay loading={loading}>
                    {legalEntityDeactivationJobs.length > 0 && (
                      <>
                        <Table
                          data={legalEntityDeactivationJobs}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            name: <Trans>Legal entity name</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            startedAt: <Trans>Started at</Trans>,
                            executionTime: <Trans>Execution time</Trans>,
                            status: <Trans>Job status</Trans>
                          }}
                          renderRow={({
                            databaseId,
                            startedAt,
                            endedAt,
                            executionTime,
                            status,
                            deactivatedLegalEntity: { name, edrpou }
                          }) => ({
                            databaseId,
                            name,
                            edrpou,
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
                              status === "PENDING" ? (
                                "-"
                              ) : (
                                <Plural
                                  value={differenceInSeconds(
                                    endedAt,
                                    startedAt
                                  )}
                                  zero="# seconds"
                                  one="# second"
                                  few="# seconds"
                                  many="# seconds"
                                  other="# seconds"
                                />
                              ),
                            status: (
                              <Badge
                                type="MERGE_LEGAL_ENTITIES_JOBS"
                                name={status}
                                display="block"
                              />
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
                          tableName="legalEntityDeactivationJobs/search"
                        />
                        <Pagination {...pageInfo} />
                      </>
                    )}
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

export default Search;

const SearchLegalEntitiesForm = ({ initialValues, onSubmit }) => (
  <Form
    initialValues={initialValues}
    onSubmit={params =>
      onSubmit({
        ...params,
        after: undefined,
        before: undefined,
        last: undefined,
        first: initialValues.first || ITEMS_PER_PAGE[0]
      })
    }
  >
    <Flex mx={-1}>
      <Box px={1} width={1 / 1.5}>
        <Trans
          id="Legal entity edrpou"
          render={({ translation }) => (
            <Field.Text
              name="filter.deactivatedLegalEntity.edrpou"
              label={<Trans>Find legal entity</Trans>}
              placeholder={translation}
              postfix={<SearchIcon color="silverCity" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.deactivatedLegalEntity.edrpou"
          options={EDRPOU_PATTERN}
          message={<Trans>Invalid number</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Job status</Trans>}
              items={Object.keys(STATUSES.MERGE_LEGAL_ENTITIES_JOBS)}
              itemToString={item =>
                STATUSES.MERGE_LEGAL_ENTITIES_JOBS[item] || translation
              }
              filterOptions={{ keys: ["value"] }}
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">
          <Trans>Search</Trans>
        </Button>
      </Box>
      <Box px={1}>
        <IconButton
          icon={RemoveItemIcon}
          type="reset"
          disabled={isEmpty(initialValues.filter)}
          onClick={() => {
            onSubmit({
              ...initialValues,
              filter: null
            });
          }}
        >
          <Trans>Reset</Trans>
        </IconButton>
      </Box>
    </Flex>
  </Form>
);
