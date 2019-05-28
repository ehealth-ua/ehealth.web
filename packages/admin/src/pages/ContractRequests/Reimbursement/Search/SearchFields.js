import React from "react";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Box, Flex } from "@rebass/emotion";
import { SearchIcon } from "@ehealth/icons";
import { Validation } from "@ehealth/components";
import STATUSES from "../../../../helpers/statuses";
import * as Field from "../../../../components/Field";
import AssigneeSearch from "../../../../components/AssigneeSearch";
import { SEARCH_REQUEST_PATTERN } from "../../../../constants/contractRequests";
import isEmpty from "lodash/isEmpty";

const SearchContractsByLegalEntitiesQuery = loader(
  "../../../../graphql/SearchContractsByLegalEntitiesQuery.graphql"
);
const MedicalProgramsQuery = loader(
  "../../../../graphql/MedicalProgramsQuery.graphql"
);

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
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
    <Box px={1} width={1 / 4}>
      <AssigneeSearch />
    </Box>
    <Box px={1} width={1 / 4}>
      {/* TODO: Move it to separate component with its own fragment*/}
      <Trans
        id="Enter legal entity name"
        render={({ translation }) => (
          <Query
            query={SearchContractsByLegalEntitiesQuery}
            variables={{ skip: true }}
          >
            {({
              data: { legalEntities: { nodes: legalEntities = [] } = {} } = {},
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
    <Box px={1} width={1 / 4}>
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

const SecondarySearchFields = () => (
  <>
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
                      program =>
                        !isEmpty(program) &&
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
  </>
);

export { PrimarySearchFields, SecondarySearchFields };
