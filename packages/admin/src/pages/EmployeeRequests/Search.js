import React from "react";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import Composer from "react-composer";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { SearchIcon, PositiveIcon, NegativeIcon } from "@ehealth/icons";

import Badge from "../../components/Badge";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/SearchForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import filteredLocationParams from "../../helpers/filteredLocationParams";

const SearchEmployeeRequestsQuery = loader(
  "../../graphql/SearchEmployeeRequestsQuery.graphql"
);
const GetLegalEntitiyToFilterQuery = loader(
  "../../graphql/GetLegalEntitiyToFilterQuery.graphql"
);

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { orderBy } = locationParams;
        return (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
              <Box>
                <Heading as="h1" fontWeight="normal" mb={4}>
                  <Trans>Employee Requests</Trans>
                </Heading>
              </Box>
            </Flex>

            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
            />

            <Query
              query={SearchEmployeeRequestsQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({ loading, error, data }) => {
                if (isEmpty(data)) return null;
                const {
                  nodes: employeeRequests = [],
                  pageInfo
                } = data.employeeRequests;
                return (
                  <LoadingOverlay loading={loading}>
                    {employeeRequests.length > 0 && (
                      <>
                        <Table
                          data={employeeRequests}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            fullName: <Trans>Name of employee</Trans>,
                            taxId: <Trans>INN</Trans>,
                            noTaxId: <Trans>No tax ID</Trans>,
                            employeeType: <Trans>Employee type</Trans>,
                            legalEntityName: <Trans>Legal entity name</Trans>,
                            insertedAt: <Trans>Inserted at</Trans>,
                            email: <Trans>Email</Trans>,
                            status: <Trans>Status</Trans>
                          }}
                          renderRow={({
                            firstName,
                            secondName,
                            lastName,
                            noTaxId,
                            employeeType,
                            legalEntity,
                            status,
                            insertedAt,
                            ...employeeData
                          }) => {
                            return {
                              ...employeeData,
                              fullName: getFullName({
                                firstName,
                                secondName,
                                lastName
                              }),
                              noTaxId: (
                                <Flex justifyContent="center">
                                  {noTaxId ? (
                                    <PositiveIcon />
                                  ) : (
                                    <NegativeIcon />
                                  )}
                                </Flex>
                              ),
                              employeeType: (
                                <DictionaryValue
                                  name="EMPLOYEE_TYPE"
                                  item={employeeType}
                                />
                              ),
                              legalEntityName: legalEntity && legalEntity.name,
                              status: (
                                <Badge
                                  name={status}
                                  type="EMPLOYEE_REQUEST_STATUS"
                                  display="block"
                                />
                              ),
                              insertedAt: <DateFormat value={insertedAt} />
                            };
                          }}
                          sortableFields={["fullName", "insertedAt", "status"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["databaseId"]}
                          tableName="employee-requests/search"
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
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter legal entity name"
        render={({ translation }) => (
          <Query
            query={GetLegalEntitiyToFilterQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: { legalEntities: { nodes: legalEntities = [] } = {} } = {},
              refetch: refetchLegalEntities
            }) => (
              <Field.Select
                name="filter.legalEntityId"
                label={<Trans>Legal entity name</Trans>}
                placeholder={translation}
                items={legalEntities.map(({ id, name }) => ({
                  id,
                  name
                }))}
                itemToString={item => item && item.name}
                filter={item => item}
                onInputValueChange={debounce(
                  (name, { selectedItem, inputValue }) =>
                    (selectedItem && selectedItem.name) !== inputValue &&
                    refetchLegalEntities({
                      skip: false,
                      first: 20,
                      filter: { name }
                    }),
                  1000
                )}
              />
            )}
          </Query>
        )}
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Enter email"
        render={({ translation }) => (
          <Field.Text
            name="filter.email"
            label={<Trans>Employee email</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Composer
        components={[
          <DictionaryValue name="EMPLOYEE_REQUEST_STATUS" />,
          ({ render }) => <Trans id="Select option" render={render} />
        ]}
      >
        {([dict, { translation }]) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Request status</Trans>}
            placeholder={translation}
            items={Object.keys(dict)}
            itemToString={item => dict[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      </Composer>
    </Box>
    <Box px={1} width={1 / 4}>
      <Field.RangePicker
        rangeNames={["filter.date.insertedAtFrom", "filter.date.insertedAtTo"]}
        label={<Trans>Employee has been inserted at</Trans>}
      />
    </Box>
  </Flex>
);

export default Search;
