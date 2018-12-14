import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import system from "system-components/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";

import { Form, Validation, LocationParams, Modal } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatDateTimeInterval
} from "@ehealth/utils";

import {
  AdminSearchIcon,
  PositiveIcon,
  FilterIcon,
  NegativeIcon,
  RemoveItemIcon
} from "@ehealth/icons";

import { SelectedItem, RemoveItem } from "../../../components/MultiSelectView";
import * as Field from "../../../components/Field";
import Link from "../../../components/Link";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import Button, { IconButton } from "../../../components/Button";
import Badge from "../../../components/Badge";
import STATUSES from "../../../helpers/statuses";

import {
  EDRPOU_PATTERN,
  SEARCH_CONTRACT_PATTERN
} from "../../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";

import ContractsNav from "../ContractsNav";

const SearchReimbursementContractsQuery = loader(
  "../../../graphql/SearchReimbursementContractsQuery.graphql"
);
const MedicalProgramsQuery = loader(
  "../../../graphql/MedicalProgramsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT).map(
  ([key, value]) => ({ key, value })
);

//TODO: bring it out to the helper
const sendFilterForm = filter => {
  if (!filter) return {};
  const {
    status = {},
    medicalProgram = {},
    searchRequest,
    isSuspended,
    date: { startFrom, startTo, endFrom, endTo } = {}
  } = filter;
  const edrpouReg = new RegExp(EDRPOU_PATTERN);
  const edrpouTest = edrpouReg.test(searchRequest);
  const contract =
    !isEmpty(searchRequest) &&
    (edrpouTest
      ? { contractorLegalEntity: { edrpou: searchRequest } }
      : { contractNumber: searchRequest });
  return {
    ...contract,
    startDate: formatDateTimeInterval(startFrom, startTo),
    endDate: formatDateTimeInterval(endFrom, endTo),
    status: status.key,
    isSuspended: convertIsSuspendedItem(isSuspended),
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

const ReimbursementContractsSearch = () => (
  <Box p={6}>
    <ContractsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;
        return (
          <>
            <Query
              query={SearchReimbursementContractsQuery}
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
              {({
                loading,
                error,
                data: {
                  reimbursementContracts: {
                    nodes: contracts = [],
                    pageInfo
                  } = {}
                } = {}
              }) => (
                <>
                  <SearchContractsForm
                    initialValues={locationParams}
                    onSubmit={setLocationParams}
                  />
                  {!error &&
                    contracts.length > 0 && (
                      <>
                        <Table
                          data={contracts}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            edrpou: <Trans>ЄДРПОУ</Trans>,
                            contractNumber: <Trans>Номер договору</Trans>,
                            startDate: <Trans>Договір діє з</Trans>,
                            endDate: <Trans>Договір діє по</Trans>,
                            medicalProgram: <Trans>Медична програма</Trans>,
                            isSuspended: <Trans>Стан договору</Trans>,
                            insertedAt: <Trans>Додано</Trans>,
                            status: <Trans>Статус</Trans>,
                            details: <Trans>Деталі</Trans>
                          }}
                          renderRow={({
                            id,
                            status,
                            isSuspended,
                            contractorLegalEntity: { edrpou },
                            insertedAt,
                            medicalProgram,
                            ...contracts
                          }) => ({
                            ...contracts,
                            edrpou,
                            medicalProgram:
                              medicalProgram && medicalProgram.name,
                            isSuspended: (
                              <Flex justifyContent="center">
                                {isSuspended ? (
                                  <PositiveIcon />
                                ) : (
                                  <NegativeIcon />
                                )}
                              </Flex>
                            ),
                            insertedAt: <DateFormat value={insertedAt} />,
                            status: (
                              <Badge
                                type="CONTRACT"
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
                            "isSuspended",
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
                          tableName="reimbursement-contract/search"
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

export default ReimbursementContractsSearch;

const SearchContractsForm = ({ initialValues, onSubmit }) => (
  <Form
    onSubmit={params =>
      onSubmit({
        ...params,
        ...resetPaginationParams(initialValues.first)
      })
    }
    initialValues={initialValues}
  >
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Trans
          id="ЄДРПОУ або Номер договору"
          render={({ translate }) => (
            <Field.Text
              name="filter.searchRequest"
              label={<Trans>Пошук договору</Trans>}
              placeholder={translate}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_CONTRACT_PATTERN}
          message={<Trans>Невірний номер</Trans>}
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
              label={<Trans>Статус договору</Trans>}
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
);

const SelectedFilters = ({ initialValues, onSubmit, toggle }) => {
  const { filter: { medicalProgram, isSuspended } = {} } = initialValues;

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
      {!isEmpty(isSuspended) && (
        <SelectedItem mx={1}>
          {renderIsSuspendedItem(isSuspended)}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  isSuspended: undefined
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
  <Modal width={800} backdrop textAlign="left">
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
      onSubmit={values => {
        onSubmit(values);
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
                label={<Trans>Статус договору</Trans>}
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
        <Box width={2 / 5} px={1} mr={1}>
          <Field.Select
            name="filter.isSuspended"
            label={<Trans>Стан договору</Trans>}
            items={["", "true", "false"]}
            renderItem={item => renderIsSuspendedItem(item)}
            itemToString={item => renderIsSuspendedItem(item)}
            type="select"
          />
        </Box>
        <Box width={2 / 5}>
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

const TextNoWrap = system(
  {
    is: Text,
    ml: 2
  },
  { whiteSpace: "nowrap" }
);

// TODO: remove this after select refactoring
const renderIsSuspendedItem = item =>
  item === "" ? (
    <Trans>всі договори</Trans>
  ) : item === "true" ? (
    <Trans>призупинений</Trans>
  ) : (
    <Trans>діючий</Trans>
  );

const convertIsSuspendedItem = item => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return undefined;
  }
};
