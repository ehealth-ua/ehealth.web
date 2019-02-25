import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { BooleanValue } from "react-values";
import { Query, Mutation } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading, Text } from "@rebass/emotion";

import { RemoveItemIcon } from "@ehealth/icons";
import { Form, LocationParams, Modal } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  convertStringToBoolean
} from "@ehealth/utils";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button, { IconButton } from "../../components/Button";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import STATUSES from "../../helpers/statuses";

const SearchProgramMedicationsQuery = loader(
  "../../graphql/SearchProgramMedicationsQuery.graphql"
);
const MedicalProgramsQuery = loader(
  "../../graphql/MedicalProgramsQuery.graphql"
);
const SearchMedicationsQuery = loader(
  "../../graphql/SearchMedicationsQuery.graphql"
);
const SearchINNMDosagesQuery = loader(
  "../../graphql/SearchINNMDosagesQuery.graphql"
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
                  <Trans>Program medications</Trans>
                </Heading>
                <Text fontSize={1}>
                  <Trans>
                    Manage a participant of medical program from the list below
                    or add the new one
                  </Trans>
                </Text>
              </Box>
              <Box>
                {
                  //TODO: add "Add participant" button & mutation here
                }
              </Box>
            </Flex>

            <SearchProgramMedicationsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={SearchProgramMedicationsQuery}
              fetchPolicy="network-only"
              variables={filteredLocationParams(locationParams)}
            >
              {({ loading, error, data }) => {
                if (error || isEmpty(data)) return null;
                const {
                  nodes: programMedications = [],
                  pageInfo
                } = data.programMedications;
                return (
                  <LoadingOverlay loading={loading}>
                    {programMedications.length > 0 && (
                      <>
                        <Table
                          data={programMedications}
                          header={{
                            medicalProgramId: <Trans>Medical program ID</Trans>,
                            medicalProgramName: (
                              <Trans>Medical program name</Trans>
                            ),
                            medicationName: <Trans>Medication name</Trans>,
                            medicationForm: <Trans>Medication form</Trans>,
                            medicationManufacturer: (
                              <Trans>Medication manufacturer</Trans>
                            ),
                            reimbursementAmount: (
                              <Trans>Reimbursement Amount</Trans>
                            ),
                            isActive: <Trans>Status</Trans>,
                            insertedAt: <Trans>Inserted at</Trans>,
                            details: <Trans>Details</Trans>
                          }}
                          renderRow={({
                            id,
                            isActive,
                            insertedAt,
                            medicalProgram: {
                              databaseId: medicalProgramId,
                              name: medicalProgramName
                            },
                            medication: {
                              name: medicationName,
                              form: medicationForm,
                              manufacturer: medicationManufacturer
                            },
                            reimbursement: { reimbursementAmount }
                          }) => {
                            return {
                              medicalProgramId,
                              medicalProgramName,
                              medicationName,
                              medicationForm,
                              medicationManufacturer: medicationManufacturer && (
                                <>
                                  {medicationManufacturer.name},{" "}
                                  {medicationManufacturer.country}
                                </>
                              ),
                              isActive: (
                                <Badge
                                  type="PROGRAM_MEDICATION_STATUS"
                                  name={isActive}
                                  variant={!isActive}
                                  display="block"
                                />
                              ),
                              reimbursementAmount,
                              insertedAt: <DateFormat value={insertedAt} />,
                              details: (
                                <Link to={`../${id}`} fontWeight="bold">
                                  <Trans>Show details</Trans>
                                </Link>
                              )
                            };
                          }}
                          sortableFields={["insertedAt"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          whiteSpaceNoWrap={["medicalProgramId"]}
                          tableName="programMedications/search"
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

const SearchProgramMedicationsForm = ({ initialValues, onSubmit }) => (
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
          id="Choose INNM dosage name"
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
                refetch: refetchINNMDosages
              }) => {
                return (
                  <Field.Select
                    name="filter.medication.innmDosage.name"
                    label={<Trans>INNM dosage name</Trans>}
                    placeholder={translation}
                    items={innmDosages.map(({ name }) => name)}
                    onInputValueChange={debounce(
                      (name, { selectedItem, inputValue }) =>
                        !isEmpty(name) &&
                        selectedItem !== inputValue &&
                        refetchINNMDosages({
                          skip: false,
                          first: 20,
                          filter: { name: name }
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
              }) => (
                <Field.Select
                  name="filter.medication.name"
                  label={<Trans>Medication name</Trans>}
                  placeholder={translation}
                  items={medications.map(({ name }) => name)}
                  onInputValueChange={debounce(
                    (name, { selectedItem, inputValue }) =>
                      !isEmpty(name) &&
                      selectedItem !== inputValue &&
                      refetchMedications({
                        skip: false,
                        first: 20,
                        filter: { name: name }
                      }),
                    1000
                  )}
                />
              )}
            </Query>
          )}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Trans
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.isActive"
              label={<Trans>Participant status</Trans>}
              items={Object.keys(STATUSES.PROGRAM_MEDICATION_STATUS)}
              itemToString={item =>
                STATUSES.PROGRAM_MEDICATION_STATUS[item] || translation
              }
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Select option"
          render={({ translation }) => (
            <Field.Select
              name="filter.medicationRequestAllowed"
              label={<Trans>Створення рецепту</Trans>}
              items={Object.keys(STATUSES.MEDICATION_REQUEST_ALLOWED)}
              itemToString={item =>
                STATUSES.MEDICATION_REQUEST_ALLOWED[item] || translation
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

const programMedicationsFilteredParams = filter => {
  const { isActive, medicationRequestAllowed, ...params } = filter;
  return {
    ...params,
    isActive: convertStringToBoolean(isActive),
    medicationRequestAllowed: convertStringToBoolean(medicationRequestAllowed)
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
    filter: filter ? programMedicationsFilteredParams(filter) : filter
  };
};
