import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { BooleanValue } from "react-values";
import { Query, Mutation } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { Flex, Box, Heading } from "@rebass/emotion";

import { SearchIcon, RemoveItemIcon, NegativeIcon } from "@ehealth/icons";
import { Form, LocationParams, Modal } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  convertStringToBoolean
} from "@ehealth/utils";
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
const DeactivateMedicalProgramMutation = loader(
  "../../graphql/DeactivateMedicalProgramMutation.graphql"
);

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Medical programs</Trans>
    </Heading>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { orderBy } = locationParams;
        return (
          <>
            <SearchMedicalProgramsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={MedicalProgramsQuery}
              fetchPolicy="network-only"
              variables={{
                ...filteredLocationParams(locationParams)
              }}
            >
              {({ loading, error, data }) => {
                if (error || isEmpty(data)) return null;
                const {
                  nodes: medicalPrograms = [],
                  pageInfo
                } = data.medicalPrograms;

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
                              <Flex justifyContent="center">
                                <NegativeIcon
                                  fill={isActive ? "#1BB934" : "#ED1C24"}
                                  stroke={isActive ? "#1BB934" : "#ED1C24"}
                                />
                              </Flex>
                            ),
                            action: (
                              <Popup
                                variant="red"
                                buttonText={<Trans>Deactivate</Trans>}
                                title={
                                  <>
                                    <Trans>Deactivate medical program</Trans>
                                    <Box pt={3}>"{medicalProgram.name}"</Box>
                                  </>
                                }
                                disabled={!isActive}
                              >
                                {toggle => (
                                  <Mutation
                                    mutation={DeactivateMedicalProgramMutation}
                                    refetchQueries={() => [
                                      {
                                        query: MedicalProgramsQuery,
                                        variables: {
                                          ...filteredLocationParams(id)
                                        }
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
                                            await deactivateMedicalProgram({
                                              variables: {
                                                input: { id }
                                              }
                                            });
                                          }}
                                          variant="red"
                                          width={140}
                                        >
                                          <Trans>Deactivate</Trans>
                                        </Button>
                                      </Flex>
                                    )}
                                  </Mutation>
                                )}
                              </Popup>
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
      <Box px={1} width={1 / 2}>
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
      <Box px={1} width={1 / 2}>
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
                    autocomplete="off"
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
    </Flex>
    <Box mx={-1} px={1} width={1 / 4}>
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

const Popup = ({
  variant,
  disabled,
  buttonText,
  title,
  children,
  render = children
}) => {
  return (
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <>
          <Flex justifyContent="center">
            <Button
              variant={variant}
              onClick={toggle}
              disabled={disabled}
              px={1}
              py={1}
              fontSize={0}
            >
              Деактивувати
            </Button>
          </Flex>

          {opened && (
            <Modal width={760} backdrop textAlign="left">
              <Heading as="h1" fontWeight="normal" textAlign="center" mb={6}>
                {title}
              </Heading>
              {render(toggle)}
            </Modal>
          )}
        </>
      )}
    </BooleanValue>
  );
};

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