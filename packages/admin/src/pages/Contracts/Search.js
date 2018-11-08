import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";

import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatDateTimeInterval
} from "@ehealth/utils";
import { AdminSearchIcon, PositiveIcon, CircleIcon } from "@ehealth/icons";

import * as Field from "../../components/Field";
import Link from "../../components/Link";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Button, { ResetButton } from "../../components/Button";
import Badge from "../../components/Badge";
import STATUSES from "../../helpers/statuses";
import {
  EDRPOU_PATTERN,
  CONTRACT_PATTERN,
  SEARCH_CONTRACT_PATTERN
} from "../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

import SearchContractsQuery from "../../graphql/SearchContractsQuery.graphql";

const contractStatuses = Object.entries(STATUSES.CONTRACT).map(
  ([name, value]) => ({ name, value })
);

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік контрактів
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { status = {}, searchRequest } = {},
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
            ? { contractorLegalEntityEdrpou: searchRequest }
            : { contractNumber: searchRequest });

        return (
          <>
            <Query
              query={SearchContractsQuery}
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
                  status: status.name
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
                            contractNumber: "Номер контракту",
                            startDate: "Контракт діє з",
                            endDate: "Контракт діє по",
                            isSuspended: "Призупинений",
                            status: "Статус",
                            details: "Деталі"
                          }}
                          renderRow={({
                            id,
                            status,
                            isSuspended,
                            contractorLegalEntity: { edrpou },
                            ...contracts
                          }) => ({
                            edrpou,
                            ...contracts,
                            isSuspended: (
                              <Flex justifyContent="center">
                                {isSuspended ? (
                                  <PositiveIcon />
                                ) : (
                                  <CircleIcon
                                    stroke="#1bb934"
                                    strokeWidth="4"
                                  />
                                )}
                              </Flex>
                            ),
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
                            "edrpou"
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
      <Box px={1} width={3 / 5}>
        <Field.Text
          name="filter.searchRequest"
          label="Пошук контракту"
          placeholder="ЄДРПОУ або Номер контракту"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_CONTRACT_PATTERN}
          message="Невірний номер"
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Field.Select
          name="filter.status"
          label="Статус контракту"
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
          label="Початок дії контракту"
        />
      </Box>
      <Box px={1} width={2 / 6}>
        <Field.RangePicker
          rangeNames={["date.endFrom", "date.endTo"]}
          label="Кінець дії контракту"
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
