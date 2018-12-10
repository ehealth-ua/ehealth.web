import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import system from "system-components/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
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
  ([name, value]) => ({ name, value })
);

const sendFilterForm = filter => {
  if (!filter) return {};
  const {
    status = {},
    medicalProgramName,
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
    startDate: () => formatDateTimeInterval(startFrom, startTo),
    endDate: () => formatDateTimeInterval(endFrom, endTo),
    status: status.name,
    isSuspended: convertIsSuspendedItem(isSuspended),
    medicalProgramName
  };
};

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
                            edrpou,
                            ...contracts,
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
                          hiddenFields="databaseId,insertedAt"
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
    </Flex>
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <>
          {opened && (
            <SearchContractsModalForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              toggle={toggle}
              refetch={refetch}
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
            <HidenFilters
              initialValues={initialValues}
              onSubmit={onSubmit}
              refetch={refetch}
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
            refetch({
              filter: undefined,
              searchRequest: undefined,
              date: undefined
            });
          }}
        >
          Скинути пошук
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

const HidenFilters = ({ initialValues, onSubmit, toggle, refetch }) => {
  const { filter: { medicalProgramName, isSuspended } = {} } = initialValues;

  return (
    <Flex flexWrap="wrap">
      {medicalProgramName && (
        <SelectedItem mx={1}>
          Медична програма: "{medicalProgramName}"
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                filter: {
                  ...initialValues.filter,
                  medicalProgramName: undefined
                }
              });
              refetch({
                ...initialValues,
                filter: sendFilterForm({
                  ...initialValues.filter,
                  medicalProgramName: undefined
                })
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
      {isSuspended !== undefined && (
        <SelectedItem mx={1}>
          {renderIsSuspendedItem(isSuspended)}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                filter: {
                  ...initialValues.filter,
                  isSuspended: undefined
                }
              });
              refetch({
                ...initialValues,
                filter: sendFilterForm({
                  ...initialValues.filter,
                  isSuspended: undefined
                })
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

const SearchContractsModalForm = ({
  initialValues,
  onSubmit,
  toggle,
  refetch
}) => (
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

    <Query
      query={MedicalProgramsQuery}
      variables={{
        filter: {
          isActive: true,
          insertedAt: "" //dirty hack for the incorrect scheme required value
        }
      }}
    >
      {({
        loading,
        error,
        data: { medicalPrograms: { nodes: medicalPrograms = [] } = {} } = {}
      }) => {
        const medicalProgramsNames = medicalPrograms.map(({ name }) => name);

        return (
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
                    rangeNames={[
                      "filter.date.startFrom",
                      "filter.date.startTo"
                    ]}
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
                <Field.Select
                  name="filter.medicalProgramName"
                  label="Медична програма"
                  items={["всі програми", ...medicalProgramsNames]}
                  renderItem={item => item}
                  itemToString={item => {
                    if (!item) return "всі програми";
                    return typeof item === "string" ? item : item.name;
                  }}
                  type="select"
                />
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
                    refetch({
                      filter: undefined,
                      searchRequest: undefined,
                      date: undefined
                    });
                  }}
                >
                  Скинути пошук
                </IconButton>
              </Box>
            </Flex>
          </Form>
        );
      }}
    </Query>
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
