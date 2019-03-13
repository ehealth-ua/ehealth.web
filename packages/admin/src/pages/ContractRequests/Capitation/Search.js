import React from "react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Box, Flex } from "@rebass/emotion";
import { Trans, DateFormat } from "@lingui/macro";
import debounce from "lodash/debounce";

import { Validation, LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { SearchIcon, RemoveItemIcon } from "@ehealth/icons";

import ContractRequestsNav from "../ContractRequestsNav";

import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Link from "../../../components/Link";
import Pagination from "../../../components/Pagination";
import * as Field from "../../../components/Field";
import AssigneeSearch from "../../../components/AssigneeSearch";
import {
  RemoveItem,
  SelectedItem
} from "../../../components/Field/MultiSelectView";
import SearchModalForm from "../../../components/SearchModalForm";
import SearchForm from "../../../components/SearchForm";
import { SEARCH_REQUEST_PATTERN } from "../../../constants/contractRequests";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import STATUSES from "../../../helpers/statuses";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";

const SearchCapitationContractRequestsQuery = loader(
  "../../../graphql/SearchCapitationContractRequestsQuery.graphql"
);

const SearchContractsByLegalEntitiesQuery = loader(
  "../../../graphql/SearchContractsByLegalEntitiesQuery.graphql"
);

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});

const CapitationContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;

        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              fields={PrimarySearchFields}
              selected={SelectedFilters}
              modal={SearchContractsModalForm}
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
                filter: contractFormFilteredParams(filter)
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
                }
              }) => {
                if (isEmpty(capitationContractRequests)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {capitationContractRequests.length > 0 && (
                      <>
                        <Table
                          data={capitationContractRequests}
                          header={{
                            databaseId: (
                              <Trans>Contract request databaseID</Trans>
                            ),
                            contractNumber: <Trans>Contract Number</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            contractorLegalEntityName: (
                              <Trans>Name of medical institution</Trans>
                            ),
                            assigneeName: <Trans>Performer</Trans>,
                            status: <Trans>Status</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
                            insertedAt: <Trans>Added</Trans>,
                            details: <Trans>Details</Trans>
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
                            ...capitationContractRequests
                          }) => ({
                            ...capitationContractRequests,
                            edrpou,
                            contractorLegalEntityName,
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
                                <Trans>Show details</Trans>
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

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="EDRPOU or Contract number"
        render={({ translation }) => (
          <Field.Text
            name="filter.searchRequest"
            label={<Trans>Search contract request</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
      <Validation.Matches
        field="filter.searchRequest"
        options={SEARCH_REQUEST_PATTERN}
        message="Invalid number"
      />
    </Box>

    <Box px={1} width={1 / 3}>
      <AssigneeSearch />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Contract Request status</Trans>}
            placeholder={translation}
            items={Object.keys(STATUSES.CONTRACT_REQUEST)}
            itemToString={item =>
              STATUSES.CONTRACT_REQUEST[item] || translation
            }
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

const SelectedFilters = ({ initialValues, onSubmit }) => {
  const {
    filter: {
      date: {
        startFrom,
        startTo,
        endFrom,
        endTo,
        insertedAtFrom,
        insertedAtTo
      } = {},
      contractorLegalEntity: { name } = {}
    } = {}
  } = initialValues;
  return (
    <Flex flexWrap="wrap">
      {(startFrom || startTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract start date</Trans>:
          {startFrom && (
            <Box ml={1}>
              з <DateFormat value={startFrom} />
            </Box>
          )}
          {startTo && (
            <Box ml={1}>
              по <DateFormat value={startTo} />
            </Box>
          )}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  date: {
                    startFrom: undefined,
                    startTo: undefined,
                    endFrom,
                    endTo,
                    insertedAtFrom,
                    insertedAtTo
                  }
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
      {(endFrom || endTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract end date</Trans>:
          {endFrom && (
            <Box ml={1}>
              з <DateFormat value={endFrom} />
            </Box>
          )}
          {endTo && (
            <Box ml={1}>
              по <DateFormat value={endTo} />
            </Box>
          )}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  date: {
                    startFrom,
                    startTo,
                    endFrom: undefined,
                    endTo: undefined,
                    insertedAtFrom,
                    insertedAtTo
                  }
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
      {(insertedAtFrom || insertedAtTo) && (
        <SelectedItem mx={1}>
          <Trans>Contract inserted date</Trans>:
          {insertedAtFrom && (
            <Box ml={1}>
              з <DateFormat value={insertedAtFrom} />
            </Box>
          )}
          {insertedAtTo && (
            <Box ml={1}>
              по <DateFormat value={insertedAtTo} />
            </Box>
          )}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  date: {
                    startFrom,
                    startTo,
                    endFrom,
                    endTo,
                    insertedAtFrom: undefined,
                    insertedAtTo: undefined
                  }
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
      {name && (
        <SelectedItem mx={1}>
          <Trans>Legal entity name</Trans>:<Box ml={1}>{name}</Box>
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                ...resetPaginationParams(initialValues.first),
                filter: {
                  ...initialValues.filter,
                  contractorLegalEntity: {
                    name: undefined
                  }
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

const SearchContractsModalForm = ({
  fields: PrimarySearchFields,
  ...props
}) => (
  <SearchModalForm {...props}>
    <PrimarySearchFields />
    <Flex>
      <Box mr={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
          label={<Trans>Contract start date</Trans>}
        />
      </Box>
      <Box width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Box>
      <Box width={1 / 3}>
        <Field.RangePicker
          rangeNames={[
            "filter.date.insertedAtFrom",
            "filter.date.insertedAtTo"
          ]}
          label={<Trans>Contract inserted date</Trans>}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Enter legal entity name"
          render={({ translation }) => (
            <Query
              query={SearchContractsByLegalEntitiesQuery}
              variables={{ skip: true }}
            >
              {({
                data: {
                  legalEntities: { nodes: legalEntities = [] } = {}
                } = {},
                refetch: refetchlegalEntities
              }) => (
                <Field.Select
                  name="filter.contractorLegalEntity"
                  label={<Trans>Legal entity name</Trans>}
                  placeholder={translation}
                  items={legalEntities.map(({ name }) => ({ name }))}
                  onInputValueChange={debounce(
                    (legalEntity, { selectedItem, inputValue }) => {
                      const name = selectedItem && selectedItem.name;
                      return (
                        name !== inputValue &&
                        refetchlegalEntities({
                          skip: false,
                          first: 20,
                          filter: {
                            name: legalEntity,
                            type: ["MSP", "MSP_PHARMACY"]
                          }
                        })
                      );
                    },
                    1000
                  )}
                  itemToString={item => item && item.name}
                  filterOptions={{ keys: ["name"] }}
                />
              )}
            </Query>
          )}
        />
      </Box>
    </Flex>
  </SearchModalForm>
);

export default CapitationContractRequestsSearch;
