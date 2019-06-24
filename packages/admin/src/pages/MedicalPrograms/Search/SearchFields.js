import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import Composer from "react-composer";
import debounce from "lodash/debounce";
import { SearchIcon } from "@ehealth/icons";
import { Flex, Box } from "@rebass/emotion";

import { Validation } from "@ehealth/components";
import * as Field from "../../../components/Field";
import * as SearchField from "../../../components/SearchField";
import DictionaryValue from "../../../components/DictionaryValue";
import { UUID_PATTERN } from "../../../constants/validationPatterns";

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 4}>
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
      <Validation.Matches
        field="filter.databaseId"
        options={UUID_PATTERN}
        message="Invalid ID"
      />
    </Box>
    <Box px={1} width={1 / 4}>
      <Trans
        id="Choose medical program"
        render={({ translation }) => (
          <Query
            query={SearchMedicalProgramsQuery}
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
    <Box px={1} width={1 / 4}>
      <SearchField.Status name="filter.isActive" status="ACTIVE_STATUS_F" />
    </Box>
    <Box px={1} width={1 / 4}>
      <Composer
        components={[
          <DictionaryValue name="MEDICAL_PROGRAM_TYPE" />,
          ({ render }) => <Trans id="Select option" render={render} />
        ]}
      >
        {([dict, { translation }]) => (
          <Field.Select
            name="filter.type"
            label={<Trans>Medical program type</Trans>}
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

const SearchMedicalProgramsQuery = gql`
  query SearchMedicalProgramsQuery(
    $first: Int
    $filter: MedicalProgramFilter
    $skip: Boolean! = false
  ) {
    medicalPrograms(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
      }
    }
  }
`;

export { PrimarySearchFields };
