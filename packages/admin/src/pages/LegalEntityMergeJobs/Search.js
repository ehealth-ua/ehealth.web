import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Router, Redirect } from "@reach/router";
import { Query } from "react-apollo";
import format from "date-fns/format";
import differenceInSeconds from "date-fns/difference_in_seconds";

import { Form, Validation, Tabs, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import STATUSES from "../../helpers/statuses";

import LegalEntitiesMergeJobsQuery from "../../graphql/LegalEntitiesMergeJobsQuery.graphql";

const EDRPOU_PATTERN = "^[0-9]{8,10}$";

const jobsStatuses = Object.entries(STATUSES.MERGE_LEGAL_ENTITIES_JOBS).map(
  ([name, value]) => ({ name, value })
);
const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={1}>
      Об’єднання медзакладів
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="./related">Підпорядковані</Tabs.Link>
      <Tabs.Link to="./main">Основний медзаклад</Tabs.Link>
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
          status: status && status.name,
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
              {({ loading, error, data }) => {
                if (loading) return null;
                const {
                  nodes: legalEntityMergeJobs = []
                } = data.legalEntityMergeJobs;
                return !error && legalEntityMergeJobs.length > 0 ? (
                  <Table
                    data={legalEntityMergeJobs}
                    header={{
                      databaseId: "ID",
                      mergedToLegalEntityName: "Основний медзаклад",
                      mergedToLegalEntityEdrpou: "ЄДРПОУ основного медзакладу",
                      mergedFromLegalEntityName:
                        "Назва підпорядкованого медзакладу",
                      mergedFromLegalEntityEdrpou:
                        "ЄДРПОУ підпорядкованого медзакладу",
                      startedAt: "Час старту задачі",
                      executionTime: "Час виконання задачі",
                      status: "Статус задачі"
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
                      startedAt: format(startedAt, "DD.MM.YYYY, HH:mm"),
                      executionTime:
                        status === "PENDING"
                          ? "-"
                          : `${differenceInSeconds(endedAt, startedAt)} с`,
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
                ) : null;
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
        <Field.Text
          name="filter.mergedFromLegalEntity.code"
          label="Знайти підпорядкований медзаклад"
          placeholder="ЄДРПОУ медзакладу"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="filter.mergedFromLegalEntity.code"
          options={EDRPOU_PATTERN}
          message="Невірний номер"
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.Select
          name="filter.status"
          label="Статус задачі"
          items={[{ value: "всі статуси", name: undefined }, ...jobsStatuses]}
          renderItem={item => item.value}
          itemToString={item => {
            if (!item) return "всі статуси";
            return typeof item === "string" ? item : item.value;
          }}
          filterOptions={{ keys: ["value"] }}
          type="select"
        />
      </Box>
    </Flex>
    <Button variant="blue">Шукати</Button>
  </Form>
);

const SearchByMainLegalEntityForm = ({ initialValues, onSubmit }) => (
  <Form initialValues={initialValues} onSubmit={onSubmit}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 1.5}>
        <Field.Text
          name="filter.mergedToLegalEntity.code"
          label="Знайти основний медзаклад"
          placeholder="ЄДРПОУ медзакладу"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="filter.mergedToLegalEntity.code"
          options={EDRPOU_PATTERN}
          message="Невірний номер"
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.Select
          name="filter.status"
          label="Статус задачі"
          items={[{ value: "всі статуси", name: undefined }, ...jobsStatuses]}
          renderItem={item => item.value}
          itemToString={item => {
            if (!item) return "всі статуси";
            return typeof item === "string" ? item : item.value;
          }}
          filterOptions={{ keys: ["value"] }}
          type="select"
        />
      </Box>
    </Flex>
    <Button variant="blue">Шукати</Button>
  </Form>
);
