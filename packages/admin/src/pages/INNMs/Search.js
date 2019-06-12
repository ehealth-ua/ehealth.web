import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { SearchIcon } from "@ehealth/icons";
import { Query, Mutation } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";
import {
  Form,
  LocationParams,
  Validation,
  Validations
} from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Badge from "../../components/Badge";
import Popup from "../../components/Popup";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Ability from "../../components/Ability";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/SearchForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import filteredLocationParams from "../../helpers/filteredLocationParams";
import {
  INNM_PATTERN,
  INNM_ORIGINAL_NAME_PATTERN,
  SCTID_PATTERN,
  UUID_PATTERN
} from "../../constants/validationPatterns";

const SearchINNMsQuery = loader("../../graphql/SearchINNMsQuery.graphql");
const CreateINNMMutation = loader("../../graphql/CreateINNMMutation.graphql");

const Search = () => {
  const [isVisible, setVisibilityState] = useState(false);
  const toggle = () => setVisibilityState(!isVisible);

  return (
    <Box p={6}>
      <LocationParams>
        {({ locationParams, setLocationParams }) => {
          const { orderBy } = locationParams;
          return (
            <>
              <Flex
                justifyContent="space-between"
                alignItems="flex-start"
                mb={6}
              >
                <Box>
                  <Heading as="h1" fontWeight="normal" mb={4}>
                    <Trans>INNMs</Trans>
                  </Heading>
                </Box>
                <Ability action="write" resource="innm">
                  <Box>
                    <Mutation
                      mutation={CreateINNMMutation}
                      refetchQueries={() => [
                        {
                          query: SearchINNMsQuery,
                          variables: filteredLocationParams(locationParams)
                        }
                      ]}
                    >
                      {createINNM => (
                        <>
                          <Button onClick={toggle} variant="green">
                            <Trans>Create INNM</Trans>
                          </Button>
                          <Popup
                            visible={isVisible}
                            onCancel={toggle}
                            title={<Trans>Create INNM</Trans>}
                            formId="createINNM"
                            okButtonProps={{ variant: "green" }}
                            justifyButtons="left"
                          >
                            <Form
                              id="createINNM"
                              onSubmit={async input => {
                                await createINNM({
                                  variables: { input }
                                });
                                toggle();
                              }}
                            >
                              <Trans
                                id="Enter INNM"
                                render={({ translation }) => (
                                  <Field.Text
                                    name="name"
                                    label={<Trans>INNM</Trans>}
                                    placeholder={translation}
                                    maxLength={100}
                                    showLengthHint
                                  />
                                )}
                              />
                              <Validations field="name">
                                <Validation.Required message="Required field" />
                                <Validation.Matches
                                  options={INNM_PATTERN}
                                  message="Invalid name"
                                />
                              </Validations>
                              <Trans
                                id="Enter original name"
                                render={({ translation }) => (
                                  <>
                                    <Field.Text
                                      name="nameOriginal"
                                      label={<Trans>INNM original name</Trans>}
                                      placeholder={translation}
                                      maxLength={100}
                                      showLengthHint
                                    />
                                    <Validations field="nameOriginal">
                                      <Validation.Required message="Required field" />
                                      <Validation.Matches
                                        options={INNM_ORIGINAL_NAME_PATTERN}
                                        message="Invalid name"
                                      />
                                    </Validations>
                                  </>
                                )}
                              />
                              <Trans
                                id="Enter SCTID"
                                render={({ translation }) => (
                                  <>
                                    <Field.Text
                                      name="sctid"
                                      label={<Trans>SCTID of INNM</Trans>}
                                      placeholder={translation}
                                      maxLength={8}
                                      format={parseDigits}
                                      showLengthHint
                                    />
                                    <Validations field="sctid">
                                      <Validation.Required message="Required field" />
                                      <Validation.Matches
                                        options={SCTID_PATTERN}
                                        message="Invalid SCTID"
                                      />
                                    </Validations>
                                  </>
                                )}
                              />
                            </Form>
                          </Popup>
                        </>
                      )}
                    </Mutation>
                  </Box>
                </Ability>
              </Flex>
              <SearchForm
                initialValues={locationParams}
                onSubmit={setLocationParams}
                renderPrimary={PrimarySearchFields}
              />
              <Query
                query={SearchINNMsQuery}
                fetchPolicy="network-only"
                variables={filteredLocationParams(locationParams)}
              >
                {({
                  loading,
                  error,
                  data: { innms: { nodes: innms = [], pageInfo } = {} }
                }) => {
                  if (isEmpty(innms)) return null;
                  return (
                    <LoadingOverlay loading={loading}>
                      {innms.length > 0 && (
                        <>
                          <Table
                            data={innms}
                            header={{
                              databaseId: <Trans>ID</Trans>,
                              name: <Trans>INNM</Trans>,
                              nameOriginal: <Trans>INNM original name</Trans>,
                              sctid: <Trans>SCTID</Trans>,
                              isActive: <Trans>Status</Trans>,
                              insertedAt: <Trans>Inserted at</Trans>
                            }}
                            renderRow={({
                              id,
                              insertedAt,
                              isActive,
                              ...innm
                            }) => ({
                              ...innm,
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
                                  type="MEDICAL_PROGRAM_STATUS"
                                  name={isActive}
                                  variant={!isActive}
                                  display="block"
                                />
                              )
                            })}
                            sortableFields={["insertedAt"]}
                            sortingParams={parseSortingParams(orderBy)}
                            onSortingChange={sortingParams =>
                              setLocationParams({
                                ...locationParams,
                                orderBy: stringifySortingParams(sortingParams)
                              })
                            }
                            whiteSpaceNoWrap={["databaseId"]}
                            tableName="INNMs/search"
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
};

export default Search;

const PrimarySearchFields = () => (
  <>
    <Flex mx={-1}>
      <Box px={1} width={1 / 4}>
        <Trans
          id="Choose INNM"
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
              }) => {
                return (
                  <Field.Select
                    name="filter.name"
                    label={<Trans>INNM</Trans>}
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
                );
              }}
            </Query>
          )}
        />
      </Box>
      <Box px={1} width={1 / 4}>
        <Trans
          id="Choose INNM original name"
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
              }) => {
                return (
                  <Field.Select
                    name="filter.nameOriginal"
                    label={<Trans>INNM original name</Trans>}
                    placeholder={translation}
                    items={innms.map(({ nameOriginal }) => nameOriginal)}
                    filter={innms => innms}
                    onInputValueChange={debounce(
                      (nameOriginal, { selectedItem, inputValue }) =>
                        !isEmpty(nameOriginal) &&
                        selectedItem !== inputValue &&
                        refetchINNMs({
                          skip: false,
                          first: 20,
                          filter: { nameOriginal }
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
      <Box px={1} width={1 / 4}>
        <Trans
          id="Enter INNM ID"
          render={({ translation }) => (
            <Field.Text
              name="filter.databaseId"
              label={<Trans>Search by INNM ID</Trans>}
              placeholder={translation}
              postfix={<SearchIcon color="silverCity" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.databaseId"
          options={UUID_PATTERN}
          message="Invalid ID"
        />
      </Box>
      <Box px={1} width={1 / 4}>
        <Trans
          id="Enter SCTID"
          render={({ translation }) => (
            <Field.Text
              name="filter.sctid"
              label={<Trans>Search by SCTID</Trans>}
              placeholder={translation}
              postfix={<SearchIcon color="silverCity" />}
              maxLength={8}
              format={parseDigits}
            />
          )}
        />
      </Box>
    </Flex>
  </>
);

const parseDigits = (data = "") => data.replace(/[^\d]/g, "");
