import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";
import { Box, Flex, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import system from "system-components/emotion";

import { Form, Validation, LocationParams, Modal } from "@ehealth/components";
import {
  formatDateTimeInterval,
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { AdminSearchIcon, FilterIcon, RemoveItemIcon } from "@ehealth/icons";

import { SelectedItem, RemoveItem } from "../../../components/MultiSelectView";
import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
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

import ContractRequestsNav from "../ContractRequestsNav";
import { Trans } from "@lingui/macro";

const SearchReimbursementContractRequestsQuery = loader(
  "../../../graphql/SearchReimbursementContractRequestsQuery.graphql"
);

const MedicalProgramsQuery = loader(
  "../../../graphql/MedicalProgramsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT_REQUEST).map(
  ([key, value]) => ({ key, value })
);

//TODO: bring it out to the helper
const sendFilterForm = filter => {
  if (!filter) return {};
  const {
    status = {},
    medicalProgram = {},
    searchRequest,
    assigneeName,
    date: { startFrom, startTo, endFrom, endTo } = {}
  } = filter;
  const edrpouReg = new RegExp(EDRPOU_PATTERN);
  const edrpouTest = edrpouReg.test(searchRequest);
  const contractRequest =
    !isEmpty(searchRequest) &&
    (edrpouTest
      ? { contractorLegalEntity: { edrpou: searchRequest } }
      : { contractNumber: searchRequest });
  return {
    ...contractRequest,
    startDate: formatDateTimeInterval(startFrom, startTo),
    endDate: formatDateTimeInterval(endFrom, endTo),
    status: status.key,
    assigneeName,
    medicalProgram: !isEmpty(medicalProgram)
      ? { name: medicalProgram.name }
      : undefined
  };
};

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});

const ReimbursementContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;
        return (
          <Query
            query={SearchReimbursementContractRequestsQuery}
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
              filter: sendFilterForm(filter)
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return null;
              const {
                nodes: reimbursementContractRequests = [],
                pageInfo
              } = data.reimbursementContractRequests;
              return (
                <>
                  <SearchContractRequestsForm
                    initialValues={locationParams}
                    onSubmit={setLocationParams}
                  />
                  {!error &&
                    reimbursementContractRequests.length > 0 && (
                      <>
                        <Table
                          data={reimbursementContractRequests}
                          header={{
                            databaseId: (
                              <Trans>ID заяви на укладення договору</Trans>
                            ),
                            edrpou: <Trans>ЄДРПОУ</Trans>,
                            contractorLegalEntityName: (
                              <Trans>Назва медзакладу</Trans>
                            ),
                            contractNumber: <Trans>Номер договору</Trans>,
                            startDate: <Trans>Договір діє з</Trans>,
                            endDate: <Trans>Договір діє по</Trans>,
                            assigneeName: <Trans>Виконавець</Trans>,
                            medicalProgram: <Trans>Медична програма</Trans>,
                            insertedAt: <Trans>Додано</Trans>,
                            status: <Trans>Статус</Trans>,
                            details: <Trans>Деталі</Trans>
                          }}
                          renderRow={({
                            id,
                            status,
                            startDate,
                            endDate,
                            contractorLegalEntity: {
                              edrpou,
                              name: contractorLegalEntityName
                            },
                            assignee,
                            insertedAt,
                            medicalProgram,
                            ...reimbursementContractRequests
                          }) => ({
                            ...reimbursementContractRequests,
                            edrpou,
                            contractorLegalEntityName,
                            medicalProgram:
                              medicalProgram && medicalProgram.name,
                            startDate: <DateFormat value={startDate} />,
                            endDate: <DateFormat value={endDate} />,
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
                          tableName="reimbursementContractRequests/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="contractorLegalEntityName,insertedAt"
                        />
                        <Pagination {...pageInfo} />
                      </>
                    )}
                </>
              );
            }}
          </Query>
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
        ...resetPaginationParams(initialValues.first)
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
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <>
          {opened && (
            <SearchContractsModalForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              toggle={toggle}
            />
          )}
          <Flex mb={4} alignItems="center">
            <Button
              variant="none"
              border="none"
              px={0}
              py={0}
              mr={2}
              color="bluePastel"
              onClick={toggle}
              type="button"
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                color="bluePastel"
              >
                <FilterIcon />
                <TextNoWrap>
                  <Trans>Показати всі фільтри</Trans>
                </TextNoWrap>
              </Flex>
            </Button>
            <SelectedFilters
              initialValues={initialValues}
              onSubmit={onSubmit}
            />
          </Flex>
        </>
      )}
    </BooleanValue>
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
            rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
            label={<Trans>Початок дії договору</Trans>}
          />
        </Box>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
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

const SelectedFilters = ({ initialValues, onSubmit, toggle }) => {
  const { filter: { medicalProgram } = {} } = initialValues;

  return (
    <Flex flexWrap="wrap">
      {!isEmpty(medicalProgram) && (
        <SelectedItem mx={1}>
          {medicalProgram.name}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  medicalProgram: undefined
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
    </Flex>
  );
};

const SearchContractsModalForm = ({ initialValues, onSubmit, toggle }) => (
  <Modal width={800} backdrop textAlign="left" overflow="visible">
    <Button
      variant="none"
      border="none"
      px={0}
      py={0}
      mb={4}
      color="bluePastel"
      onClick={toggle}
    >
      <Flex justifyContent="center" alignItems="center" color="bluePastel">
        <FilterIcon />
        <TextNoWrap>
          <Trans>Сховати фільтри</Trans>
        </TextNoWrap>
      </Flex>
    </Button>

    <Form
      onSubmit={params => {
        onSubmit({
          ...params,
          ...resetPaginationParams(initialValues.first)
        });
        toggle();
      }}
      initialValues={initialValues}
    >
      <Flex mx={-1}>
        <Box px={1} width={1 / 4}>
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
              rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
              label={<Trans>Початок дії договору</Trans>}
            />
          </Box>
          <Field.RangePicker
            rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
            label={<Trans>Кінець дії договору</Trans>}
          />
        </Flex>
      </Flex>
      <Flex mx={-1}>
        <Box px={1} width={2 / 5}>
          <Query
            query={MedicalProgramsQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: {
                medicalPrograms: { nodes: medicalPrograms = [] } = {}
              } = {},
              refetch: refetchMedicalProgram
            }) => {
              return (
                <Field.Select
                  name="filter.medicalProgram.name"
                  label={<Trans>Медична програма</Trans>}
                  items={
                    loading || error
                      ? []
                      : medicalPrograms.map(({ name }) => name)
                  }
                  onInputValueChange={debounce(
                    program =>
                      !isEmpty(program) &&
                      refetchMedicalProgram({
                        skip: false,
                        first: 20,
                        filter: { name: program }
                      }),
                    1000
                  )}
                  renderItem={item => item}
                  itemToString={item => {
                    if (!item) return "";
                    return typeof item === "string" ? item : item.name;
                  }}
                />
              );
            }}
          </Query>
        </Box>
      </Flex>
      <Flex mx={-1} mt={4} justifyContent="flex-start">
        <Box px={1}>
          <Button variant="red" onClick={toggle}>
            <Trans>Закрити</Trans>
          </Button>
        </Box>
        <Box px={1}>
          <Button variant="blue">
            <Trans>Шукати</Trans>
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
  </Modal>
);

export default ReimbursementContractRequestsSearch;

const TextNoWrap = system(
  {
    is: Text,
    ml: 2
  },
  { whiteSpace: "nowrap" }
);
