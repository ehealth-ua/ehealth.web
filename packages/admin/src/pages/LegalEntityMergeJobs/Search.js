import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Router, Redirect } from "@reach/router";
import { Query } from "react-apollo";
import differenceInSeconds from "date-fns/difference_in_seconds";
import { loader } from "graphql.macro";
import { Trans, DateFormat, Plural } from "@lingui/macro";

import { Form, Validation, Tabs, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import STATUSES from "../../helpers/statuses";

const LegalEntitiesMergeJobsQuery = loader(
  "../../graphql/LegalEntitiesMergeJobsQuery.graphql"
);

const EDRPOU_PATTERN = "^[0-9]{8,10}$";

const jobsStatuses = Object.entries(STATUSES.MERGE_LEGAL_ENTITIES_JOBS).map(
  ([key, value]) => ({ key, value })
);
const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={1}>
      <Trans>Merge legal entities</Trans>
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="./related">
        <Trans>Related</Trans>
      </Tabs.Link>
      <Tabs.Link to="./main">
        <Trans>Main</Trans>
      </Tabs.Link>
    </Tabs.Nav>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: {
            mergedToLegalEntity: { code: mergedToLegalEntityCode } = {},
            mergedFromLegalEntity: { code: mergedFromLegalEntityCode } = {},
            status
          } = {},
          orderBy
        } = locationParams;

        const edrpouReg = new RegExp(EDRPOU_PATTERN);
        const edrpouTest = edrpouReg.test(
          mergedToLegalEntityCode || mergedFromLegalEntityCode
        );
        const mergedToLegalEntity =
          edrpouTest && mergedToLegalEntityCode
            ? { edrpou: mergedToLegalEntityCode }
            : { id: mergedToLegalEntityCode };
        const mergedFromLegalEntity =
          edrpouTest && mergedFromLegalEntityCode
            ? { edrpou: mergedFromLegalEntityCode }
            : { id: mergedFromLegalEntityCode };

        const filter = {
          status: status && status.key,
          mergedToLegalEntity,
          mergedFromLegalEntity
        };
        return (
          <>
            <Router>
              <Redirect from="/" to={`${uri}/related`} />
              <SearchByRelatedLegalEntityForm
                path="related"
                initialValues={locationParams}
                onSubmit={setLocationParams}
              />
              <SearchByMainLegalEntityForm
                path="main"
                initialValues={locationParams}
                onSubmit={setLocationParams}
              />
            </Router>
            <Query
              query={LegalEntitiesMergeJobsQuery}
              fetchPolicy="network-only"
              variables={{
                first: 10,
                filter,
                orderBy
              }}
            >
              {({
                loading,
                error,
                data: {
                  legalEntityMergeJobs: {
                    nodes: legalEntityMergeJobs = []
                  } = {}
                } = {}
              }) => {
                if (error) return `Error! ${error.message}`;
                return (
                  <LoadingOverlay loading={loading}>
                    {legalEntityMergeJobs.length > 0 ? (
                      <Table
                        data={legalEntityMergeJobs}
                        header={{
                          databaseId: <Trans>ID</Trans>,
                          mergedToLegalEntityName: (
                            <Trans>Main legal entity name</Trans>
                          ),
                          mergedToLegalEntityEdrpou: (
                            <Trans>Main legal entity edrpou</Trans>
                          ),
                          mergedFromLegalEntityName: (
                            <Trans>Related legal entity name</Trans>
                          ),
                          mergedFromLegalEntityEdrpou: (
                            <Trans>Related legal entity edrpou</Trans>
                          ),
                          startedAt: <Trans>Started at</Trans>,
                          executionTime: <Trans>Execution time</Trans>,
                          status: <Trans>Job status</Trans>
                        }}
                        renderRow={({
                                      databaseId,
                                      mergedToLegalEntity: {
                                        name: mergedToLegalEntityName,
                                        edrpou: mergedToLegalEntityEdrpou
                                      },
                                      mergedFromLegalEntity: {
                                        name: mergedFromLegalEntityName,
                                        edrpou: mergedFromLegalEntityEdrpou
                                      },
                                      startedAt,
                                      endedAt,
                                      executionTime,
                                      status
                                    }) => ({
                          databaseId,
                          mergedToLegalEntityName,
                          mergedToLegalEntityEdrpou,
                          mergedFromLegalEntityName,
                          mergedFromLegalEntityEdrpou,
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
                                value={differenceInSeconds(endedAt, startedAt)}
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
                            orderBy: stringifySortingParams(sortingParams)
                          })
                        }
                        tableName="legalEntityMergeJobs/search"
                      />
                    ) : null}
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

const SearchByRelatedLegalEntityForm = ({ initialValues, onSubmit }) => (
  <Form initialValues={initialValues} onSubmit={onSubmit}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 1.5}>
        <Trans
          id="Legal entity edrpou"
          render={({ translation }) => (
            <Field.Text
              name="filter.mergedFromLegalEntity.code"
              label={<Trans>Search related legal entity</Trans>}
              placeholder={translation}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.mergedFromLegalEntity.code"
          options={EDRPOU_PATTERN}
          message={<Trans>Wrong number</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Job status</Trans>}
              items={[{ value: translation, key: undefined }, ...jobsStatuses]}
              renderItem={item => item.value}
              itemToString={item => {
                if (!item) return translation;
                return typeof item === "string" ? item : item.value;
              }}
              filterOptions={{ keys: ["value"] }}
              type="select"
            />
          )}
        />
      </Box>
    </Flex>
    <Button variant="blue">
      <Trans>Search</Trans>
    </Button>
  </Form>
);

const SearchByMainLegalEntityForm = ({ initialValues, onSubmit }) => (
  <Form initialValues={initialValues} onSubmit={onSubmit}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 1.5}>
        <Trans
          id="Legal entity edrpou"
          render={({ translation }) => (
            <Field.Text
              name="filter.mergedToLegalEntity.code"
              label={<Trans>Search main legal entity</Trans>}
              placeholder={translation}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.mergedToLegalEntity.code"
          options={EDRPOU_PATTERN}
          message={<Trans>Wrong number</Trans>}
        />
      </Box>

      <Box px={1} width={1 / 3}>
        <Trans
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Job status</Trans>}
              items={[{ value: translation, key: undefined }, ...jobsStatuses]}
              renderItem={item => item.value}
              itemToString={item => {
                if (!item) return translation;
                return typeof item === "string" ? item : item.value;
              }}
              filterOptions={{ keys: ["value"] }}
              type="select"
            />
          )}
        />
      </Box>
    </Flex>
    <Button variant="blue">
      <Trans>Search</Trans>
    </Button>
  </Form>
);
