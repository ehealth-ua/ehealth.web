import React from "react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import format from "date-fns/format";
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

const SearchReimbursementContractRequestsQuery = loader(
  "../../../graphql/SearchReimbursementContractRequestsQuery.graphql"
);

const MedicalProgramsQuery = loader(
  "../../../graphql/MedicalProgramsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT_REQUEST).map(
  ([name, value]) => ({ name, value })
);

const sendFilterForm = filter => {
  if (!filter) return {};
  const {
    status = {},
    searchRequest,
    medicalProgramName,
    assigneeName,
    date: { startFrom, startTo, endFrom, endTo } = {}
  } = filter;
  const edrpouReg = new RegExp(EDRPOU_PATTERN);
  const edrpouTest = edrpouReg.test(searchRequest);
  const contractRequest =
    !isEmpty(searchRequest) &&
    (edrpouTest
      ? { contractorLegalEntityEdrpou: searchRequest }
      : { contractNumber: searchRequest });
  return {
    ...contractRequest,
    startDate: formatDateTimeInterval(startFrom, startTo),
    endDate: formatDateTimeInterval(endFrom, endTo),
    status: status.name,
    assigneeName,
    medicalProgramName
  };
};

const ReimbursementContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;

        return (
          <>
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
              {({
                loading,
                error,
                data: {
                  reimbursementContractRequests: {
                    nodes: reimbursementContractRequests = [],
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
                      reimbursementContractRequests.length > 0 && (
                        <>
                          <Table
                            data={reimbursementContractRequests}
                            header={{
                              databaseId: "ID заяви на укладення договору",
                              edrpou: "ЄДРПОУ",
                              contractorLegalEntityName: "Назва медзакладу",
                              contractNumber: "Номер договору",
                              startDate: "Договір діє з",
                              endDate: "Договір діє по",
                              assigneeName: "Виконавець",
                              medicalProgram: "Медична програма",
                              insertedAt: "Додано",
                              status: "Статус",
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
                              medicalProgram: { nodes: medicalPrograms = [] },
                              ...reimbursementContractRequests
                            }) => ({
                              edrpou,
                              contractorLegalEntityName,
                              ...reimbursementContractRequests,
                              medicalProgram:
                                !isEmpty(medicalPrograms) &&
                                medicalPrograms
                                  .map(({ name }) => name)
                                  .join(", "),
                              insertedAt: format(
                                insertedAt,
                                "DD.MM.YYYY, HH:mm"
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
                            tableName="reimbursementContractRequests/search"
                            whiteSpaceNoWrap={["databaseId"]}
                            hiddenFields="databaseId,contractorLegalEntityName,insertedAt"
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
              type="button"
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
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

const HidenFilters = ({ initialValues, onSubmit, toggle, refetch }) => {
  const { filter: { medicalProgramName } = {} } = initialValues;

  return (
    <Flex flexWrap="wrap">
      {medicalProgramName && (
        <SelectedItem mx={1}>
          Медична програма: "{medicalProgramName}"
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                after: undefined,
                before: undefined,
                last: undefined,
                first: initialValues.first || ITEMS_PER_PAGE[0],
                filter: {
                  ...initialValues.filter,
                  medicalProgramName: undefined
                }
              });
              refetch({
                ...initialValues,
                first: parseInt(initialValues.first) || ITEMS_PER_PAGE[0],
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
    </Flex>
  );
};

const SearchContractsModalForm = ({
  initialValues,
  onSubmit,
  toggle,
  refetch
}) => (
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
            onSubmit={params => {
              onSubmit({
                ...params,
                after: undefined,
                before: undefined,
                last: undefined,
                first: initialValues.first || ITEMS_PER_PAGE[0]
              });
              toggle();
            }}
            initialValues={initialValues}
          >
            <Flex mx={-1}>
              <Box px={1} width={1 / 4}>
                <Field.Select
                  name="filter.status"
                  label="Статус заяви"
                  items={[{ value: "всі статуси" }, ...contractStatuses]}
                  renderItem={item => item.value}
                  itemToString={item => {
                    if (!item) return "всі статуси";
                    return typeof item === "string" ? item : item.value;
                  }}
                  type="select"
                  maxHeight={100}
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
              <Box px={1} width={2 / 5}>
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

export default ReimbursementContractRequestsSearch;

const TextNoWrap = system(
  {
    is: Text,
    ml: 2
  },
  { whiteSpace: "nowrap" }
);
