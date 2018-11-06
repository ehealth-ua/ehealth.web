import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";

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

const EDRPOU_PATTERN = "^[0-9]{8,10}$";
const CONTRACT_REQUEST_PATTERN =
  "^[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}$";
const SEARCH_REQUEST_PATTERN = `(${EDRPOU_PATTERN})|(${CONTRACT_REQUEST_PATTERN})`;

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік заяв на укладення договору
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { status = {} } = {},
          filter,
          searchRequest = "",
          date: { startFrom, startTo, endFrom, endTo } = {}
        } = locationParams;

        const edrpouReg = new RegExp(EDRPOU_PATTERN);
        const edrpouTest = edrpouReg.test(searchRequest);
        const contractRequest =
          !isEmpty(searchRequest) &&
          (edrpouTest
            ? { contractorLegalEntityEdrpou: searchRequest }
            : { contractNumber: searchRequest });

        const startDate = startFrom
          ? `${startFrom}/${startTo || ".."}`
          : undefined;

        const endDate = endFrom ? `${endFrom}/${endTo || ".."}` : undefined;

        return (
          <>
            <Query
              query={SearchContractRequestsQuery}
              variables={{
                ...locationParams,
                filter: {
                  ...filter,
                  startDate,
                  endDate,
                  ...contractRequest,
                  status: status.name
                },
                first: 10
              }}
            >
              {({
                loading,
                error,
                data: {
                  contractRequests: { nodes: contractRequests = [] } = {}
                },
                refetch
              }) => (
                <>
                  <SearchContractRequestsForm
                    initialValues={locationParams}
                    onSubmit={setLocationParams}
                    refetch={refetch}
                  />
                  {!error &&
                    contractRequests.length > 0 && (
                      <Table
                        data={contractRequests}
                        header={{
                          id: "ID заяви на укладення договору",
                          contractNumber: "Номер договору",
                          status: "Статус",
                          startDate: "Договір діє з",
                          endDate: "Договір діє по",
                          details: "Деталі"
                        }}
                        renderRow={({ id, status, ...contractRequests }) => ({
                          id,
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
                        sortingParams={parseSortingParams(
                          locationParams.orderBy
                        )}
                        onSortingChange={sortingParams =>
                          setLocationParams({
                            ...locationParams,
                            orderBy: stringifySortingParams(sortingParams)
                          })
                        }
                        tableName="contractrequests/search"
                      />
                    )}
                </>
              )}
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const SearchContractRequestsForm = ({ initialValues, onSubmit, refetch }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
    <Flex mx={-1}>
      <Box px={1} width={3 / 5}>
        <Field.Text
          name="searchRequest"
          label="Пошук запиту"
          placeholder="ЄДРПОУ або Номер договору"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="searchRequest"
          options={SEARCH_REQUEST_PATTERN}
          message="Невірний номер"
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
          name="filter.status"
          label="Статус договору"
          placeholder="test"
          items={[{ value: "всі статуси" }, ...contractStatuses]}
          renderItem={item => item.value}
          itemToString={item => {
            if (!item) return "всі статуси";
            return typeof item === "string" ? item : item.value;
          }}
          type="select"
        />
      </Box>

      <Box px={1} width={2 / 6}>
        <Field.RangePicker
          rangeNames={["date.startFrom", "date.startTo"]}
          label="Початок дії договору"
        />
      </Box>
      <Box px={1} width={2 / 6}>
        <Field.RangePicker
          rangeNames={["date.endFrom", "date.endTo"]}
          label="Кінець дії договору"
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={[1 / 2, 1 / 2, 1 / 6]}>
        <Button variant="blue">Шукати</Button>
      </Box>
      <Box px={1} width={[1 / 2, 1 / 2, 1 / 6]}>
        <ResetButton
          onClick={() => {
            onSubmit({
              ...initialValues,
              filter: null,
              searchRequest: null,
              date: null
            });
            refetch({
              filter: undefined,
              searchRequest: undefined,
              date: undefined
            });
          }}
        >
          Скинути пошук
        </ResetButton>
      </Box>
    </Flex>
  </Form>
);
