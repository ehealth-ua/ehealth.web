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
import { SEARCH_CONTRACT_PATTERN } from "../../../../constants/contracts";

const SearchContractsByLegalEntitiesQuery = loader(
  "../../../../graphql/SearchContractsByLegalEntitiesQuery.graphql"
);

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="EDRPOU or Contract number"
        render={({ translation }) => (
          <Field.Text
            name="filter.searchRequest"
            label={<Trans>Search contract</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
      <Validation.Matches
        field="filter.searchRequest"
        options={SEARCH_CONTRACT_PATTERN}
        message="Invalid number"
      />
    </Box>
    <Box px={1} width={1 / 3}>
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
                  (legalEntity, { selectedItem, inputValue }) =>
                    selectedItem !== inputValue &&
                    refetchlegalEntities({
                      skip: false,
                      first: 20,
                      filter: {
                        name: legalEntity,
                        type: ["MSP", "MSP_PHARMACY"]
                      }
                    }),
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
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Contract status</Trans>}
            placeholder={translation}
            items={Object.keys(STATUSES.CONTRACT)}
            itemToString={item => STATUSES.CONTRACT[item] || translation}
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
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
          label={<Trans>Contract start date</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box width={1 / 3} px={1}>
        <Trans
          id="All contracts"
          render={({ translation }) => (
            <Field.Select
              name="filter.isSuspended"
              label={<Trans>Suspended</Trans>}
              placeholder={translation}
              items={Object.keys(STATUSES.SUSPENDED)}
              itemToString={item => STATUSES.SUSPENDED[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
      <Box width={1 / 3} px={1}>
        <Trans
          id="All contracts"
          render={({ translation }) => (
            <Field.Select
              name="filter.legalEntityRelation"
              label={<Trans>Legal entity relation</Trans>}
              placeholder={translation}
              items={Object.keys(STATUSES.LEGAL_ENTITY_RELATION)}
              itemToString={item =>
                STATUSES.LEGAL_ENTITY_RELATION[item] || translation
              }
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
    </Flex>
  </>
);

export { PrimarySearchFields, SecondarySearchFields };
