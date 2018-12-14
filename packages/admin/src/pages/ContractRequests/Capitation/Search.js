import React from "react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Box, Flex } from "rebass/emotion";
import { Trans, DateFormat } from "@lingui/macro";

import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  formatDateTimeInterval,
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { AdminSearchIcon, RemoveItemIcon } from "@ehealth/icons";

import ContractRequestsNav from "../ContractRequestsNav";

import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Link from "../../../components/Link";
import Pagination from "../../../components/Pagination";
import * as Field from "../../../components/Field";
import Button, { IconButton } from "../../../components/Button";

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
            <SearchContractRequestsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
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
                if (error) return `Error! ${error.message}`;
                return (
                  <LoadingOverlay loading={loading}>
                    {capitationContractRequests.length > 0 && (
                      <>
                        <Table
                          data={capitationContractRequests}
                          header={{
                            databaseId: (
                              <Trans>ID заяви на укладення договору</Trans>
                            ),
                            contractNumber: <Trans>Номер договору</Trans>,
                            edrpou: <Trans>ЄДРПОУ</Trans>,
                            contractorLegalEntityName: (
                              <Trans>Назва медзакладу</Trans>
                            ),
                            assigneeName: <Trans>Виконавець</Trans>,
                            status: <Trans>Статус</Trans>,
                            startDate: <Trans>Договір діє з</Trans>,
                            endDate: <Trans>Договір діє по</Trans>,
                            insertedAt: <Trans>Додано</Trans>,
                            details: <Trans>Деталі</Trans>
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
                                <Trans>Показати деталі</Trans>
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

const SearchContractRequestsForm = ({ initialValues, onSubmit }) => (
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
      <Box px={1} width={1 / 2}>
        <Trans
          id="ЄДРПОУ або Номер договору"
          render={({ translate }) => (
            <Field.Text
              name="filter.searchRequest"
              label={<Trans>Пошук заяви</Trans>}
              placeholder={translate}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_REQUEST_PATTERN}
          message={<Trans>Невірний номер</Trans>}
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <Trans
          id="Оберіть виконавця"
          render={({ translate }) => (
            <Field.Text
              name="filter.assigneeName"
              label={<Trans>Виконавець</Trans>}
              placeholder={translate}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Trans
          id="All statuses"
          render={({ translate }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Статус заяви</Trans>}
              placeholder={translate}
              items={[{ value: translate }, ...contractStatuses]}
              renderItem={item => item.value}
              itemToString={item => {
                if (!item) return translate;
                return typeof item === "string" ? item : item.value;
              }}
              type="select"
            />
          )}
        />
      </Box>

      <Flex px={1}>
        <Box mr={1}>
          <Field.RangePicker
            rangeNames={["date.startFrom", "date.startTo"]}
            label={<Trans>Початок дії договору</Trans>}
          />
        </Box>

        <Field.RangePicker
          rangeNames={["date.endFrom", "date.endTo"]}
          label={<Trans>Кінець дії договору</Trans>}
        />
      </Flex>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">
          <Trans>Шукати</Trans>
        </Button>
      </Box>
      <Box px={1}>
        <IconButton
          icon={RemoveItemIcon}
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
          }}
        >
          <Trans>Скинути пошук</Trans>
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

export default CapitationContractRequestsSearch;
