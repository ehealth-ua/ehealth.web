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
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

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
import LoadingOverlay from "../../../components/LoadingOverlay";
import Button, { IconButton } from "../../../components/Button";
import Badge from "../../../components/Badge";
import STATUSES from "../../../helpers/statuses";

import { SEARCH_CONTRACT_PATTERN } from "../../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";

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
            <SearchContractsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
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
                filter: contractFormFilteredParams(filter)
              }}
            >
              {({ loading, error, data }) => {
                if (error || isEmpty(data)) return null;
                const {
                  nodes: contracts = [],
                  pageInfo
                } = data.reimbursementContracts;

                return (
                  <LoadingOverlay loading={loading}>
                    {contracts.length > 0 && (
                      <>
                        <Table
                          data={contracts}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            contractNumber: <Trans>Contract Number</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
                            medicalProgram: <Trans>Medical program</Trans>,
                            isSuspended: <Trans>Contract state</Trans>,
                            insertedAt: <Trans>Added</Trans>,
                            status: <Trans>Status</Trans>,
                            details: <Trans>Details</Trans>
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
                                {!isSuspended ? (
                                  <NegativeIcon
                                    fill="#1BB934"
                                    stroke="#1BB934"
                                  />
                                ) : (
                                  <NegativeIcon
                                    fill="#ED1C24"
                                    stroke="#ED1C24"
                                  />
                                )}
                              </Flex>
                            ),
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
                            status: (
                              <Badge
                                type="CONTRACT"
                                name={status}
                                display="block"
                              />
                            ),
                            details: (
                              <Link to={`./${id}`} fontWeight="bold">
                                <Trans>Show details</Trans>
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
          id="EDRPOU or Contract number"
          render={({ translation }) => (
            <Field.Text
              name="filter.searchRequest"
              label={<Trans>Search contract</Trans>}
              placeholder={translation}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_CONTRACT_PATTERN}
          message={<Trans>Invalid number</Trans>}
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
                  <Trans>Show all filters</Trans>
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
          render={({ translation }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Contract status</Trans>}
              placeholder={translation}
              items={[{ value: translation }, ...contractStatuses]}
              renderItem={item => item.value}
              itemToString={item => {
                if (!item) return translation;
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
            label={<Trans>Contract start date</Trans>}
          />
        </Box>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Flex>
    </Flex>

    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">
          <Trans>Search</Trans>
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
              searchRequest: null
            });
          }}
        >
          <Trans>Reset</Trans>
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
          <Trans>Hide filters</Trans>
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
            render={({ translation }) => (
              <Field.Select
                name="filter.status"
                label={<Trans>Contract status</Trans>}
                placeholder={translation}
                items={[{ value: translation }, ...contractStatuses]}
                renderItem={item => item.value}
                itemToString={item => {
                  if (!item) return translation;
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
              label={<Trans>Contract start date</Trans>}
            />
          </Box>
          <Field.RangePicker
            rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
            label={<Trans>Contract end date</Trans>}
          />
        </Flex>
      </Flex>
      <Flex mx={-1}>
        <Box width={2 / 5} px={1} mr={1}>
          <Field.Select
            name="filter.isSuspended"
            label={<Trans>Contract state</Trans>}
            items={["", "true", "false"]}
            renderItem={item => renderIsSuspendedItem(item)}
            itemToString={item => renderIsSuspendedItem(item)}
            type="select"
          />
        </Box>
        <Box width={2 / 5}>
          <Trans
            id="Choose medical program"
            render={({ translation }) => (
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
                      label={<Trans>Medical program</Trans>}
                      placeholder={translation}
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
            )}
          />
        </Box>
      </Flex>
      <Flex mx={-1} mt={4} justifyContent="flex-start">
        <Box px={1}>
          <Button variant="red" onClick={toggle}>
            <Trans>Close</Trans>
          </Button>
        </Box>
        <Box px={1}>
          <Button variant="blue">
            <Trans>Search</Trans>
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
                searchRequest: null
              });
            }}
          >
            <Trans>Reset</Trans>
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
  item === "" ? "всі договори" : item === "true" ? "призупинений" : "діючий";
