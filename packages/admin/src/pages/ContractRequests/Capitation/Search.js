import React from "react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import format from "date-fns/format";
import { Box, Flex } from "rebass/emotion";

import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  formatDateTimeInterval,
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { AdminSearchIcon } from "@ehealth/icons";

import ContractRequestsNav from "../ContractRequestsNav";

import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import Link from "../../../components/Link";
import Pagination from "../../../components/Pagination";
import * as Field from "../../../components/Field";
import Button, { ResetButton } from "../../../components/Button";

import {
  EDRPOU_PATTERN,
  SEARCH_REQUEST_PATTERN
} from "../../../constants/contractRequests";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import STATUSES from "../../../helpers/statuses";

const SearchCapitationContractRequestsQuery = loader(
  "../../../graphql/SearchCapitationContractRequestsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT_REQUEST).map(
  ([name, value]) => ({ name, value })
);

const CapitationContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { status = {}, searchRequest, assigneeName } = {},
          date: { startFrom, startTo, endFrom, endTo } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;

        const edrpouReg = new RegExp(EDRPOU_PATTERN);
        const edrpouTest = edrpouReg.test(searchRequest);
        const contractRequest =
          !isEmpty(searchRequest) &&
          (edrpouTest
            ? { contractorLegalEntityEdrpou: searchRequest }
            : { contractNumber: searchRequest });

        return (
          <>
            <Query
              query={SearchCapitationContractRequestsQuery}
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
                  ...contractRequest,
                  startDate: formatDateTimeInterval(startFrom, startTo),
                  endDate: formatDateTimeInterval(endFrom, endTo),
                  status: status.name,
                  assigneeName
                }
              }}
            >
              {({
                loading,
                error,
                data: {
                  capitationContractRequests: {
                    nodes: capitationContractRequests = [],
                    pageInfo
                  } = {}
                } = {},
                refetch
              }) => {
                return (
                  <>
                    <SearchContractRequestsForm
                      initialValues={locationParams}
                      onSubmit={setLocationParams}
                      refetch={refetch}
                    />
                    {!error &&
                      capitationContractRequests.length > 0 && (
                        <>
                          <Table
                            data={capitationContractRequests}
                            header={{
                              databaseId: "ID заяви на укладення договору",
                              contractNumber: "Номер договору",
                              edrpou: "ЄДРПОУ",
                              contractorLegalEntityName: "Назва медзакладу",
                              assigneeName: "Виконавець",
                              status: "Статус",
                              startDate: "Договір діє з",
                              endDate: "Договір діє по",
                              insertedAt: "Додано",
                              details: "Деталі"
                            }}
                            renderRow={({
                              id,
                              status,
                              contractorLegalEntity: {
                                edrpou,
                                name: contractorLegalEntityName
                              },
                              assignee,
                              insertedAt,
                              ...capitationContractRequests
                            }) => ({
                              edrpou,
                              contractorLegalEntityName,
                              insertedAt: format(
                                insertedAt,
                                "DD.MM.YYYY, HH:mm"
                              ),
                              assigneeName: assignee
                                ? getFullName(assignee.party)
                                : undefined,
                              ...capitationContractRequests,
                              status: (
                                <Badge
                                  type="CONTRACT_REQUEST"
                                  name={status}
                                  display="block"
                                />
                              ),
                              details: (
                                <Link to={`./${id}`} fontWeight="bold">
                                  Показати деталі
                                </Link>
                              )
                            })}
                            sortableFields={[
                              "status",
                              "startDate",
                              "endDate",
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
                            tableName="capitationContractRequests/search"
                            whiteSpaceNoWrap={["databaseId"]}
                          />
                          <Pagination {...pageInfo} />
                        </>
                      )}
                  </>
                );
              }}
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

const SearchContractRequestsForm = ({ initialValues, onSubmit, refetch }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Field.Text
          name="filter.searchRequest"
          label="Пошук заяви"
          placeholder="ЄДРПОУ або Номер договору"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_REQUEST_PATTERN}
          message="Невірний номер"
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <Field.Text
          name="filter.assigneeName"
          label="Виконавець"
          placeholder="Оберіть виконавця"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Field.Select
          name="filter.status"
          label="Статус заяви"
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

export default CapitationContractRequestsSearch;
