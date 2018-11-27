import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import format from "date-fns/format";
import { loader } from "graphql.macro";

import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatDateTimeInterval
} from "@ehealth/utils";
import { AdminSearchIcon, PositiveIcon, NegativeIcon } from "@ehealth/icons";

import * as Field from "../../components/Field";
import Link from "../../components/Link";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Button, { ResetButton } from "../../components/Button";
import Badge from "../../components/Badge";
import STATUSES from "../../helpers/statuses";
import {
  EDRPOU_PATTERN,
  SEARCH_CONTRACT_PATTERN
} from "../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const SearchContractsQuery = loader(
  "../../graphql/SearchContractsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT).map(
  ([name, value]) => ({ name, value })
);

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік договорів
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { status = {}, searchRequest, isSuspended } = {},
          date: { startFrom, startTo, endFrom, endTo } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;

        const edrpouReg = new RegExp(EDRPOU_PATTERN);
        const edrpouTest = edrpouReg.test(searchRequest);
        const contract =
          !isEmpty(searchRequest) &&
          (edrpouTest
            ? { contractorLegalEntity: { edrpou: searchRequest } }
            : { contractNumber: searchRequest });
        return (
          <>
            <Query
              query={SearchContractsQuery}
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
                filter: {
                  ...contract,
                  startDate: formatDateTimeInterval(startFrom, startTo),
                  endDate: formatDateTimeInterval(endFrom, endTo),
                  status: status.name,
                  isSuspended: convertIsSuspendedItem(isSuspended)
                }
              }}
            >
              {({
                loading,
                error,
                data: {
                  contracts: { nodes: contracts = [], pageInfo } = {}
                } = {},
                refetch
              }) => (
                <>
                  <SearchContractsForm
                    initialValues={locationParams}
                    onSubmit={setLocationParams}
                    refetch={refetch}
                  />
                  {!error &&
                    contracts.length > 0 && (
                      <>
                        <Table
                          data={contracts}
                          header={{
                            databaseId: "ID",
                            edrpou: "ЄДРПОУ",
                            contractNumber: "Номер договору",
                            startDate: "Договір діє з",
                            endDate: "Договір діє по",
                            isSuspended: "Стан договору",
                            insertedAt: "Додано",
                            status: "Статус",
                            details: "Деталі"
                          }}
                          renderRow={({
                            id,
                            status,
                            isSuspended,
                            contractorLegalEntity: { edrpou },
                            insertedAt,
                            ...contracts
                          }) => ({
                            edrpou,
                            ...contracts,
                            isSuspended: (
                              <Flex justifyContent="center">
                                {isSuspended ? (
                                  <PositiveIcon />
                                ) : (
                                  <NegativeIcon />
                                )}
                              </Flex>
                            ),
                            insertedAt: format(insertedAt, "DD.MM.YYYY, HH:mm"),
                            status: (
                              <Badge
                                type="CONTRACT"
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
                          sortableFields={[
                            "status",
                            "startDate",
                            "endDate",
                            "isSuspended",
                            "edrpou",
                            "insertedAt"
                          ]}
                          sortingParams={parseSortingParams(
                            locationParams.orderBy
                          )}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          tableName="contract/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="insertedAt"
                        />
                        <Pagination {...pageInfo} />
                      </>
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

const SearchContractsForm = ({ initialValues, onSubmit, refetch }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Field.Text
          name="filter.searchRequest"
          label="Пошук договору"
          placeholder="ЄДРПОУ або Номер договору"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_CONTRACT_PATTERN}
          message="Невірний номер"
        />
      </Box>
      <Box px={1} width={2 / 5}>
        <Field.Select
          name="filter.isSuspended"
          label="Стан договору"
          items={["", "true", "false"]}
          renderItem={item => renderIsSuspendedItem(item)}
          itemToString={item => renderIsSuspendedItem(item)}
          type="select"
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

      <Flex px={1}>
        <Box mr={1}>
          <Field.RangePicker
            rangeNames={["date.startFrom", "date.startTo"]}
            label="Початок дії договору"
          />
        </Box>
        <Field.RangePicker
          rangeNames={["date.endFrom", "date.endTo"]}
          label="Кінець дії договору"
        />
      </Flex>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">Шукати</Button>
      </Box>
      <Box px={1}>
        <ResetButton
          type="reset"
          disabled={
            isEmpty(initialValues.filter) && isEmpty(initialValues.date)
          }
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

const renderIsSuspendedItem = item =>
  item === "" ? "всі договори" : item === "true" ? "діючий" : "призупинений";

const convertIsSuspendedItem = item => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return undefined;
  }
};
