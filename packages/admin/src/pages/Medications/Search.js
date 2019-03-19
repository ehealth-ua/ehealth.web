import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Query } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/SearchForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import filteredLocationParams from "../../helpers/filteredLocationParams";
import Composer from "react-composer";
import DictionaryValue from "../../components/DictionaryValue";
import STATUSES from "../../helpers/statuses";
import Link from "../../components/Link";

const SearchMedicationsQuery = loader(
  "../../graphql/SearchMedicationsQuery.graphql"
);
const SearchINNMDosagesQuery = loader(
  "../../graphql/SearchINNMDosagesQuery.graphql"
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
                  <Trans>Medications</Trans>
                </Heading>
              </Box>
              <Box>
                <Button onClick={() => navigate("../create")} variant="green">
                  <Trans>Create medication</Trans>
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
              query={SearchMedicationsQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({
                loading,
                error,
                data: {
                  medications: { nodes: medications = [], pageInfo } = {}
                } = {}
              }) => {
                if (isEmpty(medications)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {medications.length > 0 && (
                      <>
                        <Table
                          data={medications}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            name: <Trans>Medication name</Trans>,
                            innmDosageName: <Trans>InnmDosage name</Trans>,
                            manufacturerName: <Trans>Manufacturer name</Trans>,
                            manufacturerCountry: (
                              <Trans>Manufacturer country</Trans>
                            ),
                            isActive: <Trans>Status</Trans>,
                            insertedAt: <Trans>Inserted at</Trans>,
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({
                            id,
                            databaseId,
                            insertedAt,
                            isActive,
                            name,
                            ingredients,
                            manufacturer: {
                              name: manufacturerName,
                              country: manufacturerCountry
                            }
                          }) => {
                            const [primaryIngredient] = ingredients.filter(
                              f => f.isPrimary
                            );
                            const innmDosageName =
                              primaryIngredient.innmDosage.name;
                            return {
                              databaseId,
                              name,
                              innmDosageName,
                              manufacturerName,
                              manufacturerCountry,
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
                              isActive: (
                                <Badge
                                  type="ACTIVE_STATUS_F"
                                  name={isActive}
                                  variant={!isActive}
                                  display="block"
                                />
                              ),
                              action: (
                                <Link to={`../${id}`} fontWeight="bold">
                                  Деталі
                                </Link>
                              )
                            };
                          }}
                          sortableFields={["insertedAt", "name"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["databaseId"]}
                          tableName="medication/search"
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

export default Search;

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Choose medication name"
        render={({ translation }) => (
          <Query
            query={SearchMedicationsQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: { medications: { nodes: medications = [] } = {} } = {},
              refetch: refetchMedications
            }) => {
              return (
                <Field.Select
                  name="filter.name"
                  label={<Trans>Medication name</Trans>}
                  placeholder={translation}
                  items={medications.map(({ name }) => name)}
                  filter={medications => medications}
                  onInputValueChange={debounce(
                    (name, { selectedItem, inputValue }) =>
                      selectedItem !== inputValue &&
                      refetchMedications({
                        skip: false,
                        first: 10,
                        filter: { name }
                      }),
                    1000
                  )}
                />
              );
            }}
          </Query>
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Choose InnmDosage name"
        render={({ translation }) => (
          <Query
            query={SearchINNMDosagesQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: { innmDosages: { nodes: innmDosages = [] } = {} } = {},
              refetch: refetchInnmDosages
            }) => {
              return (
                <Field.Select
                  name="filter.innmDosages"
                  label={<Trans>InnmDosage name</Trans>}
                  placeholder={translation}
                  items={innmDosages.map(({ name }) => name)}
                  filter={innmDosages => innmDosages}
                  onInputValueChange={debounce(
                    (name, { selectedItem, inputValue }) =>
                      selectedItem !== inputValue &&
                      refetchInnmDosages({
                        skip: false,
                        first: 10,
                        filter: { name }
                      }),
                    1000
                  )}
                />
              );
            }}
          </Query>
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter manufacturer name"
        render={({ translation }) => (
          <Field.Text
            name="filter.manufacturer.name"
            label={<Trans>Manufacturer name</Trans>}
            placeholder={translation}
          />
        )}
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <Flex>
    <Box px={1} width={1 / 3}>
      <Composer
        components={[
          <DictionaryValue name="MEDICATION_FORM" />,
          ({ render }) => <Trans id="All forms" render={render} />
        ]}
      >
        {([dict, { translation }]) => (
          <Field.Select
            name="filter.form"
            label={<Trans>Medication form</Trans>}
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
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.isActive"
            label={<Trans>Status</Trans>}
            items={Object.keys(STATUSES.ACTIVE_STATUS_F)}
            itemToString={item => STATUSES.ACTIVE_STATUS_F[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);
