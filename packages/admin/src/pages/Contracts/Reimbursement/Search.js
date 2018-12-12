import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import system from "system-components/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import format from "date-fns/format";
import { loader } from "graphql.macro";

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
                            databaseId: "ID",
                            edrpou: "ЄДРПОУ",
                            contractNumber: "Номер договору",
                            startDate: "Договір діє з",
                            endDate: "Договір діє по",
                            medicalProgram: "Медична програма",
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
                            insertedAt: format(insertedAt, "DD.MM.YYYY, HH:mm"),
                            status: (
                              <Badge
                                type="CONTRACT"
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
                <TextNoWrap>Показати всі фільтри</TextNoWrap>
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
        <Field.Select
          name="filter.status"
          label="Статус договору"
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
            rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
            label="Початок дії договору"
          />
        </Box>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label="Кінець дії договору"
        />
      </Flex>
    </Flex>

    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">Шукати</Button>
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
          Скинути пошук
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
        <TextNoWrap>Сховати фільтри</TextNoWrap>
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
          <Field.Select
            name="filter.status"
            label="Статус договору"
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
              rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
              label="Початок дії договору"
            />
          </Box>
          <Field.RangePicker
            rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
            label="Кінець дії договору"
          />
        </Flex>
      </Flex>
      <Flex mx={-1}>
        <Box width={2 / 5} px={1} mr={1}>
          <Field.Select
            name="filter.isSuspended"
            label="Стан договору"
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
                  label="Медична програма"
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
            Закрити
          </Button>
        </Box>
        <Box px={1}>
          <Button variant="blue">Шукати</Button>
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
            Скинути пошук
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

const renderIsSuspendedItem = item =>
  item === "" ? "всі договори" : item === "true" ? "діючий" : "призупинений";

const convertIsSuspendedItem = item => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return undefined;
  }
};
