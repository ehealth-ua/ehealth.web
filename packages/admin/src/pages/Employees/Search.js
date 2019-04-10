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

import Link from "../../components/Link";
import Table from "../../components/Table";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/SearchForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import filteredLocationParams from "../../helpers/filteredLocationParams";
import STATUSES from "../../helpers/statuses";

const SearchEmployeesQuery = loader(
  "../../graphql/SearchEmployeesQuery.graphql"
);
const SearchLegalEntitiesQuery = loader(
  "../../graphql/SearchLegalEntitiesQuery.graphql"
);

const Search = ({ navigate }) => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { orderBy } = locationParams;
        return (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
              <Box>
                <Heading as="h1" fontWeight="normal" mb={4}>
                  <Trans>Employees</Trans>
                </Heading>
              </Box>
              <Box>
                <Button onClick={() => navigate("../create")} variant="green">
                  <Trans>Create employee</Trans>
                </Button>
              </Box>
            </Flex>

            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              renderSecondary={SecondarySearchFields}
            />
            <Query
              query={SearchEmployeesQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({ loading, error, data }) => {
                if (isEmpty(data)) return null;
                const { nodes: employees = [], pageInfo } = data.employees;
                return (
                  <LoadingOverlay loading={loading}>
                    {employees.length > 0 && (
                      <>
                        <Table
                          data={employees}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            partyFullName: <Trans>Name of employee</Trans>,
                            taxId: <Trans>INN</Trans>,
                            noTaxId: <Trans>No tax ID</Trans>,
                            position: <Trans>Position</Trans>,
                            startDate: <Trans>Start date</Trans>,
                            employeeType: <Trans>Employee type</Trans>,
                            legalEntityName: <Trans>Legal entity name</Trans>,
                            divisionName: <Trans>Division name</Trans>,
                            status: <Trans>Status</Trans>,
                            details: <Trans>Details</Trans>
                          }}
                          renderRow={({
                            id,
                            party: { noTaxId, taxId, ...party } = {},
                            position,
                            employeeType,
                            startDate,
                            legalEntity,
                            division,
                            status,
                            ...employeeData
                          }) => ({
                            ...employeeData,
                            partyFullName: getFullName(party),
                            taxId,
                            noTaxId: (
                              <Flex justifyContent="center">
                                {noTaxId ? <PositiveIcon /> : <NegativeIcon />}
                              </Flex>
                            ),
                            position: (
                              <DictionaryValue
                                name="POSITION"
                                item={position}
                              />
                            ),
                            employeeType: (
                              <DictionaryValue
                                name="EMPLOYEE_TYPE"
                                item={employeeType}
                              />
                            ),
                            startDate: <DateFormat value={startDate} />,
                            legalEntityName: legalEntity && legalEntity.name,
                            divisionName: division && division.name,
                            status: (
                              <DictionaryValue
                                name="EMPLOYEE_STATUS"
                                item={status}
                              />
                            ),
                            details: (
                              <Link to={`../${id}`} fontWeight="bold">
                                <Trans>Show details</Trans>
                              </Link>
                            )
                          })}
                          sortableFields={[
                            "partyFullName",
                            "legalEntityName",
                            "divisionName",
                            "status",
                            "employeeType"
                          ]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["databaseId"]}
                          tableName="employees/search"
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
        id="Enter full name"
        render={({ translation }) => (
          <Field.Text
            name="filter.party.fullName"
            label={<Trans>Full name</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter legal entity name"
        render={({ translation }) => (
          <Query
            query={SearchLegalEntitiesQuery}
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
                name="filter.legalEntity.name"
                label={<Trans>Legal entity name</Trans>}
                placeholder={translation}
                items={legalEntities.map(({ name }) => name)}
                filter={items => items}
                onInputValueChange={debounce(
                  (name, { selectedItem, inputValue }) =>
                    !isEmpty(name) &&
                    selectedItem !== inputValue &&
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
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter division name"
        render={({ translation }) => (
          <Field.Text
            name="filter.division.name"
            label={<Trans>Division name</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Composer
          components={[
            <DictionaryValue name="EMPLOYEE_TYPE" />,
            ({ render }) => <Trans id="Select option" render={render} />
          ]}
        >
          {([dict, { translation }]) => (
            <Field.Select
              name="filter.employeeType"
              label={<Trans>Employee type</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        </Composer>
      </Box>
      <Box px={1} width={1 / 3}>
        <Composer
          components={[
            <DictionaryValue name="POSITION" />,
            ({ render }) => <Trans id="Select option" render={render} />
          ]}
        >
          {([dict, { translation }]) => (
            <Field.Select
              name="filter.position"
              label={<Trans>Position</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        </Composer>
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.startDate.from", "filter.startDate.to"]}
          label={<Trans>Start date</Trans>}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Composer
          components={[
            <DictionaryValue name="EMPLOYEE_STATUS" />,
            ({ render }) => <Trans id="Select option" render={render} />
          ]}
        >
          {([dict, { translation }]) => (
            <Field.Select
              name="filter.employeeStatus"
              label={<Trans>Employee status</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        </Composer>
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Select option"
          render={({ translation }) => (
            <Field.Select
              name="filter.party.noTaxId"
              label={<Trans>Tax ID existance</Trans>}
              items={Object.keys(STATUSES.NO_TAX_ID)}
              itemToString={item => STATUSES.NO_TAX_ID[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
    </Flex>
  </>
);

export default Search;
