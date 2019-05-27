import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Composer from "react-composer";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Trans } from "@lingui/macro";
import { Box, Flex } from "@rebass/emotion";
import { SearchIcon } from "@ehealth/icons";
import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";
import DictionaryValue from "../../../components/DictionaryValue";

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

const SearchLegalEntitiesQuery = gql`
  query SearchLegalEntitiesQuery(
    $filter: LegalEntityFilter
    $first: Int
    $skip: Boolean = false
  ) {
    legalEntities(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
      }
    }
  }
`;

export { PrimarySearchFields, SecondarySearchFields };
