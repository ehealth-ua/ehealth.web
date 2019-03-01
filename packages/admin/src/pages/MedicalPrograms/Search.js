import React from "react";
import isEmpty from "lodash/isEmpty";
import { ifProp } from "styled-tools";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { BooleanValue } from "react-values";
import { mixed } from "@ehealth/system-tools";
import { Query, Mutation } from "react-apollo";
import system from "@ehealth/system-components";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading, Text } from "@rebass/emotion";

import { SearchIcon, RemoveItemIcon } from "@ehealth/icons";
import { Form, LocationParams, Modal, Validation } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  convertStringToBoolean
} from "@ehealth/utils";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button, { IconButton } from "../../components/Button";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import STATUSES from "../../helpers/statuses";

const MedicalProgramsQuery = loader(
  "../../graphql/MedicalProgramsQuery.graphql"
);
const CreateMedicalProgramMutation = loader(
  "../../graphql/CreateMedicalProgramMutation.graphql"
);
const DeactivateMedicalProgramMutation = loader(
  "../../graphql/DeactivateMedicalProgramMutation.graphql"
);

const Search = ({ uri }) => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { orderBy } = locationParams;
        return (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
              <Box>
                <Heading as="h1" fontWeight="normal" mb={4}>
                  <Trans>Medical programs</Trans>
                </Heading>
                <Text fontSize={1}>
                  <Trans>
                    Manage a program from the list below or add the new one
                  </Trans>
                </Text>
              </Box>
              <Box>
                <BooleanValue>
                  {({ value: opened, toggle }) => (
                    <>
                      <Button onClick={toggle} variant="green">
                        <Trans>Add program</Trans>
                      </Button>

                      {opened && (
                        <Modal width={760} backdrop textAlign="left">
                          <Heading
                            as="h1"
                            fontWeight="normal"
                            textAlign="center"
                            mb={6}
                          >
                            <Trans>Add new medical program</Trans>
                          </Heading>
                          <Mutation
                            mutation={CreateMedicalProgramMutation}
                            refetchQueries={() => [
                              {
                                query: MedicalProgramsQuery,
                                variables: filteredLocationParams(
                                  locationParams
                                )
                              }
                            ]}
                          >
                            {createMedicalProgram => (
                              <Form
                                onSubmit={async name => {
                                  await createMedicalProgram({
                                    variables: {
                                      input: { ...name }
                                    }
                                  });
                                  toggle();
                                }}
                              >
                                <Trans
                                  id="Enter program name"
                                  render={({ translation }) => (
                                    <>
                                      <Field.Text
                                        name="name"
                                        label={
                                          <Trans>Medical program name</Trans>
                                        }
                                        placeholder={translation}
                                      />
                                      <Validation.Required
                                        field="name"
                                        message="Required field"
                                      />
                                    </>
                                  )}
                                />
                                <Flex justifyContent="left">
                                  <Box mr={4}>
                                    <Button variant="blue" onClick={toggle}>
                                      <Trans>Back</Trans>
                                    </Button>
                                  </Box>
                                  <Button type="submit" variant="green">
                                    <Trans>Add program</Trans>
                                  </Button>
                                </Flex>
                              </Form>
                            )}
                          </Mutation>
                        </Modal>
                      )}
                    </>
                  )}
                </BooleanValue>
              </Box>
            </Flex>
            <SearchMedicalProgramsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={MedicalProgramsQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({
                loading,
                error,
                data: {
                  medicalPrograms: {
                    nodes: medicalPrograms = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(medicalPrograms)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {medicalPrograms.length > 0 && (
                      <>
                        <Table
                          data={medicalPrograms}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            name: <Trans>Medical program name</Trans>,
                            isActive: <Trans>Status</Trans>,
                            insertedAt: <Trans>Inserted at</Trans>,
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({
                            id,
                            insertedAt,
                            isActive,
                            ...medicalProgram
                          }) => ({
                            ...medicalProgram,
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
                            ),
                            action: (
                              <BooleanValue>
                                {({ value: opened, toggle }) => (
                                  <>
                                    <DeactivateButton
                                      onClick={isActive ? toggle : null}
                                      disabled={!isActive}
                                    >
                                      <Trans>Deactivate</Trans>
                                    </DeactivateButton>

                                    {opened && (
                                      <Modal
                                        width={760}
                                        backdrop
                                        textAlign="left"
                                      >
                                        <Heading
                                          as="h1"
                                          fontWeight="normal"
                                          textAlign="center"
                                          mb={6}
                                        >
                                          <Trans>
                                            Deactivate medical program
                                          </Trans>
                                          <Box pt={3}>
                                            "{medicalProgram.name}"
                                          </Box>
                                        </Heading>
                                        <Mutation
                                          mutation={
                                            DeactivateMedicalProgramMutation
                                          }
                                          refetchQueries={() => [
                                            {
                                              query: MedicalProgramsQuery,
                                              variables: filteredLocationParams(
                                                locationParams
                                              )
                                            }
                                          ]}
                                        >
                                          {deactivateMedicalProgram => (
                                            <Flex justifyContent="center">
                                              <Box mr={20}>
                                                <Button
                                                  variant="blue"
                                                  onClick={toggle}
                                                  width={140}
                                                >
                                                  <Trans>Back</Trans>
                                                </Button>
                                              </Box>
                                              <Button
                                                onClick={async () => {
                                                  await deactivateMedicalProgram(
                                                    {
                                                      variables: {
                                                        input: { id }
                                                      }
                                                    }
                                                  );
                                                  toggle();
                                                }}
                                                variant="red"
                                                width={140}
                                              >
                                                <Trans>Deactivate</Trans>
                                              </Button>
                                            </Flex>
                                          )}
                                        </Mutation>
                                      </Modal>
                                    )}
                                  </>
                                )}
                              </BooleanValue>
                            )
                          })}
                          sortableFields={["name", "insertedAt"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["databaseId"]}
                          tableName="medicalPrograms/search"
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

const SearchMedicalProgramsForm = ({ initialValues, onSubmit }) => (
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
      <Box px={1} width={1 / 3}>
        <Trans
          id="Medical program ID"
          render={({ translation }) => (
            <Field.Text
              name="filter.databaseId"
              label={<Trans>Find medical program</Trans>}
              placeholder={translation}
              postfix={<SearchIcon color="silverCity" />}
            />
          )}
        />
      </Box>
      <Box px={1} width={1 / 3}>
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
                    name="filter.name"
                    label={<Trans>Medical program</Trans>}
                    placeholder={translation}
                    items={medicalPrograms.map(({ name }) => name)}
                    onInputValueChange={debounce(
                      (program, { selectedItem, inputValue }) =>
                        !isEmpty(program) &&
                        selectedItem !== inputValue &&
                        refetchMedicalProgram({
                          skip: false,
                          first: 20,
                          filter: { name: program }
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
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.isActive"
              label={<Trans>Program status</Trans>}
              items={Object.keys(STATUSES.MEDICAL_PROGRAM_STATUS)}
              itemToString={item =>
                STATUSES.MEDICAL_PROGRAM_STATUS[item] || translation
              }
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
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
              filter: null
            });
          }}
        >
          <Trans>Reset</Trans>
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

const medicalProgramsFilteredParams = filter => {
  const { isActive, ...params } = filter;
  return {
    ...params,
    isActive: convertStringToBoolean(isActive)
  };
};

const filteredLocationParams = (params = {}) => {
  const { filter, first, last, ...pagination } = params;
  return {
    ...pagination,
    skip: false,
    first:
      !first && !last ? ITEMS_PER_PAGE[0] : first ? parseInt(first) : undefined,
    last: last ? parseInt(last) : undefined,
    filter: filter ? medicalProgramsFilteredParams(filter) : filter
  };
};

const DeactivateButton = system(
  {
    is: Text
  },
  props =>
    mixed({
      cursor: ifProp("disabled", "not-allowed", "pointer")(props),
      fontWeight: "bold",
      color: ifProp("disabled", "januaryDawn", "rockmanBlue")(props)
    })
);
