import React from "react";
import { Query } from "react-apollo";
import Composer from "react-composer";
import { Trans } from "@lingui/macro";
import { loader } from "graphql.macro";
import debounce from "lodash/debounce";
import { Flag, FlagsProvider } from "flag";
import { Box, Flex } from "@rebass/emotion";
import { SearchIcon } from "@ehealth/icons";
import { normalizeName } from "@ehealth/utils";
import { Validation } from "@ehealth/components";
import * as Field from "../../../components/Field";
import AddressView from "../../../components/AddressView";
import DictionaryValue from "../../../components/DictionaryValue";
import STATUSES from "../../../helpers/statuses";
import flags from "../../../flags";

const SettlementsQuery = loader("../../../graphql/SettlementsQuery.graphql");

const EDRPOU_PATTERN = "^[0-9]{8,10}$";
const LEGALENTITY_ID_PATTERN =
  "^[0-9A-Za-zА]{8}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{12}$";
const SEARCH_REQUEST_PATTERN = `(${EDRPOU_PATTERN})|(${LEGALENTITY_ID_PATTERN})`;

const PrimarySearchFields = ({ initialValues: { addresses } }) => (
  <FlagsProvider flags={flags}>
    <>
      <Flex mx={-1}>
        <Box px={1} width={1 / 2}>
          <Trans
            id="Legal entity EDRPOU or ID"
            render={({ translation }) => (
              <Field.Text
                name="filter.code"
                label={<Trans>Search legal entity by EDRPOU</Trans>}
                placeholder={translation}
                postfix={<SearchIcon color="silverCity" />}
                autoComplete="off"
              />
            )}
          />
          <Validation.Matches
            field="filter.code"
            options={SEARCH_REQUEST_PATTERN}
            message="Invalid number"
          />
        </Box>
      </Flex>
      <Flex mx={-1}>
        <Flag name="features.searchBySettlement">
          <Box px={1} width={1 / 4}>
            <Trans
              id="Enter settlement"
              render={({ translation }) => (
                <Query
                  query={SettlementsQuery}
                  variables={{ ...addresses, skip: true }}
                >
                  {({
                    data: {
                      settlements: { nodes: settlements = [] } = {}
                    } = {},
                    refetch: refetchSettlements
                  }) => (
                    <Field.Select
                      name="filter.addresses"
                      label={<Trans>Settlement</Trans>}
                      placeholder={translation}
                      items={settlements}
                      filter={item => item}
                      onInputValueChange={debounce(
                        (settlement, { selectedItem, inputValue }) => {
                          const selectedName =
                            selectedItem && selectedItem.name.toLowerCase();
                          const inputName =
                            inputValue && inputValue.toLowerCase();

                          return (
                            selectedName !== inputName &&
                            refetchSettlements({
                              skip: false,
                              first: 20,
                              filter: { name: settlement }
                            })
                          );
                        },
                        1000
                      )}
                      itemToString={item => item && normalizeName(item.name)}
                      renderItem={address => <AddressView data={address} />}
                      filterOptions={{ keys: ["name"] }}
                    />
                  )}
                </Query>
              )}
            />
          </Box>
        </Flag>

        <Box px={1} width={1 / 4}>
          <Composer
            components={[
              <DictionaryValue name="LEGAL_ENTITY_TYPE" />,
              ({ render }) => <Trans id="Show all" render={render} />
            ]}
          >
            {([dict, { translation }]) => (
              <Field.Select
                name="filter.type"
                label={<Trans>Legal entity type</Trans>}
                placeholder={translation}
                items={Object.keys(dict).filter(key => key !== "MIS")}
                itemToString={item => dict[item] || translation}
                variant="select"
                emptyOption
              />
            )}
          </Composer>
        </Box>
        <Box px={1} width={1 / 4}>
          <Composer
            components={[
              <DictionaryValue name="LEGAL_ENTITY_STATUS" />,
              ({ render }) => <Trans id="All statuses" render={render} />
            ]}
          >
            {([dict, { translation }]) => (
              <Field.Select
                name="filter.nhsVerified"
                label={<Trans>Verification status</Trans>}
                placeholder={translation}
                items={Object.keys(dict)}
                itemToString={item => dict[item] || translation}
                variant="select"
                emptyOption
              />
            )}
          </Composer>
        </Box>

        <Box px={1} width={1 / 4}>
          <Trans
            id="Select option"
            render={({ translation }) => (
              <Field.Select
                name="filter.edrVerified"
                label={<Trans>EDR Verification</Trans>}
                items={Object.keys(STATUSES.EDR_VERIFY_STATUS)}
                itemToString={item =>
                  STATUSES.EDR_VERIFY_STATUS[item] || translation
                }
                variant="select"
                emptyOption
              />
            )}
          />
        </Box>
      </Flex>
    </>
  </FlagsProvider>
);

export { PrimarySearchFields };
