import React from "react";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import Composer from "react-composer";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";

import { SearchIcon } from "@ehealth/icons";
import { LocationParams } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/SearchForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import filteredLocationParams from "../../helpers/filteredLocationParams";
import STATUSES from "../../helpers/statuses";

const SearchINNMDosagesQuery = loader(
  "../../graphql/SearchINNMDosagesQuery.graphql"
);
const SearchINNMsQuery = loader("../../graphql/SearchINNMsQuery.graphql");

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
                  <Trans>INNM dosages</Trans>
                </Heading>
              </Box>
              <Box>
                <Button onClick={() => navigate("../create")} variant="green">
                  <Trans>Create INNM Dosage</Trans>
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
              query={SearchINNMDosagesQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({ loading, error, data }) => {
                if (isEmpty(data)) return null;
                const { nodes: innmDosages = [], pageInfo } = data.innmDosages;
                return (
                  <LoadingOverlay loading={loading}>
                    {innmDosages.length > 0 && (
                      <>
                        <Table
                          data={innmDosages}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            name: <Trans>Name</Trans>,
                            form: <Trans>Medication form</Trans>,
                            isActive: <Trans>Status</Trans>,
                            insertedAt: <Trans>Inserted at</Trans>,
                            details: <Trans>Details</Trans>
                          }}
                          renderRow={({
                            id,
                            form,
                            isActive,
                            insertedAt,
                            ...innmDosage
                          }) => {
                            return {
                              ...innmDosage,
                              form: (
                                <DictionaryValue
                                  name="MEDICATION_FORM"
                                  item={form}
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
                              insertedAt: <DateFormat value={insertedAt} />,
                              details: (
                                <Link to={`../${id}`} fontWeight="bold">
                                  <Trans>Show details</Trans>
                                </Link>
                              )
                            };
                          }}
                          sortableFields={["form", "name", "insertedAt"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["databaseId"]}
                          tableName="innmDosages/search"
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
        id="Enter ingredient name"
        render={({ translation }) => (
          <Query
            query={SearchINNMsQuery}
            fetchPolicy="cache-first"
            variables={{
              skip: true
            }}
          >
            {({
              loading,
              error,
              data: { innms: { nodes: innms = [] } = {} } = {},
              refetch: refetchINNMs
            }) => (
              <Field.Select
                name="filter.ingredients.innm.name"
                label={<Trans>Ingredient name</Trans>}
                placeholder={translation}
                items={innms.map(({ name }) => name)}
                filter={innms => innms}
                onInputValueChange={debounce(
                  (name, { selectedItem, inputValue }) =>
                    !isEmpty(name) &&
                    selectedItem !== inputValue &&
                    refetchINNMs({
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
        id="Enter INNM dosage name"
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
              refetch: refetchMedications
            }) => (
              <Field.Select
                name="filter.name"
                label={<Trans>INNM dosage name</Trans>}
                placeholder={translation}
                items={innmDosages.map(({ name }) => name)}
                filter={items => items}
                onInputValueChange={debounce(
                  (name, { selectedItem, inputValue }) =>
                    !isEmpty(name) &&
                    selectedItem !== inputValue &&
                    refetchMedications({
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

const SecondarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="Enter ID"
        render={({ translation }) => (
          <Field.Text
            name="filter.databaseId"
            label={<Trans>INNM dosage ID</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
    </Box>
    <Box px={1} width={1 / 3}>
      <Composer
        components={[
          <DictionaryValue name="MEDICATION_UNIT" />,
          ({ render }) => <Trans id="Select option" render={render} />
        ]}
      >
        {([dict, { translation }]) => (
          <Field.Select
            name="filter.form"
            label={<Trans>Form</Trans>}
            placeholder={translation}
            items={Object.keys(dict)}
            itemToString={item => dict[item] || translation}
            variant="select"
            emptyOption
          />
        )}
      </Composer>
    </Box>
  </Flex>
);

export default Search;
