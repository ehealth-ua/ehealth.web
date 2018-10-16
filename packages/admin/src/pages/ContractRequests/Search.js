import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import { getIn } from "final-form";

import { Form, Validation, LocationParams } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import { AdminSearchIcon } from "@ehealth/icons";

import * as Field from "../../components/Field";
import Link from "../../components/Link";
import Table from "../../components/Table";
import Button, { ResetButton } from "../../components/Button";
import Badge from "../../components/Badge";
import STATUSES from "../../helpers/statuses";

import SearchContractRequestsQuery from "../../graphql/SearchContractRequestsQuery.graphql";

const contractStatuses = Object.entries(STATUSES.CONTRACT_REQUEST).map(
  ([name, value]) => ({ name, value })
);

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік запитів на укладення контракту
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        return (
          <>
            <SearchContractRequestsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />

            <Query
              query={SearchContractRequestsQuery}
              variables={locationParams}
            >
              {({ loading, error, data: { contractRequests = {} }, refetch }) =>
                !error &&
                contractRequests.nodes &&
                contractRequests.nodes.length > 0 ? (
                  <Table
                    data={contractRequests.nodes}
                    header={{
                      id: "ID запиту на контракт",
                      contractNumber: "Номер контракту",
                      status: "Статус",
                      startDate: "Контракт діє з",
                      endDate: "Контракт діє по",
                      details: "Деталі"
                    }}
                    renderRow={({
                      id,
                      contractNumber,
                      status,
                      startDate,
                      endDate,
                      details,
                      ...contractRequests
                    }) => ({
                      id,
                      contractNumber,
                      startDate,
                      endDate,
                      ...contractRequests,
                      status: (
                        <Badge
                          type="CONTRACT_REQUEST"
                          name={status}
                          display="block"
                        />
                      ),
                      details: (
                        <Link to={`../${id}`} fontWeight="bold">
                          Показати деталі
                        </Link>
                      )
                    })}
                    sortableFields={["status", "startDate", "endDate"]}
                    sortingParams={parseSortingParams(locationParams.orderBy)}
                    onSortingChange={sortingParams =>
                      setLocationParams({
                        orderBy: stringifySortingParams(sortingParams)
                      })
                    }
                    tableName="contractrequests/search"
                  />
                ) : null
              }
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const validateRequiredObjectField = objectPath => (value, allValues) => {
  const object = getIn(allValues, objectPath) || {};
  return !(Object.values(object).some(v => v) && !value);
};

const SearchContractRequestsForm = ({ initialValues, onSubmit }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
    <Flex mx={-1}>
      <Box px={1} width={3 / 5}>
        <Field.Text
          name="filter.contractNumber"
          label="Пошук запиту"
          placeholder="ЄДРПОУ або Номер контракту"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <Field.Select
          type="select"
          name="filter.assigneeName"
          label="Виконавець"
          placeholder="Оберіть виконавця"
          itemToString={value => value}
          renderItem={value => value}
          size="small"
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Field.Select
          name="status"
          label="Статус контракту"
          items={[
            { value: "всі статуси", name: undefined },
            ...contractStatuses
          ]}
          renderItem={item => item.value}
          itemToString={item => {
            if (!item) return "всі статуси";
            return typeof item === "string" ? item : item.value;
          }}
          filterOptions={{ keys: ["value"] }}
          type="select"
        />
      </Box>

      <Box px={1} width={2 / 6}>
        <Field.RangePicker
          rangeNames={["filter.startDateFrom", "filter.startDateTo"]}
          label="Початок дії контракту"
        />
        <Validation
          field="filter.startDateFrom"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
        <Validation
          field="filter.startDateTo"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
      </Box>
      <Box px={1} width={2 / 6}>
        <Field.RangePicker
          rangeNames={["filter.endDateFrom", "filter.endDateTo"]}
          label="Кінець дії контракту"
        />
        <Validation
          field="filter.endDateFrom"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
        <Validation
          field="filter.endDateTo"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Button variant="blue">Шукати</Button>
      </Box>
      <Box px={1} width={1 / 6}>
        <ResetSearch />
      </Box>
    </Flex>
  </Form>
);

const ResetSearch = () => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => (
      <ResetButton onClick={() => setLocationParams({ filter: null })}>
        Скинути пошук
      </ResetButton>
    )}
  </LocationParams>
);
