//@flow
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Form } from "@ehealth/components";
import { Box, Flex } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import { NegativeIcon, PositiveIcon, SearchIcon } from "@ehealth/icons";
import { convertStringToBoolean, getPhones } from "@ehealth/utils";
import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import * as Field from "../../../components/Field";
import EmptyData from "../../../components/EmptyData";
import Pagination from "../../../components/Pagination";
import AddressView from "../../../components/AddressView";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import STATUSES from "../../../helpers/statuses";

import type { Scalars } from "@ehealth-ua/schema";

import { LegalEntityQuery } from "./";

const Divisions = ({ id }: { id: Scalars.ID }) => (
  <Ability action="read" resource="division">
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          first,
          last,
          after,
          before,
          filter: { divisionFilter, dlsVerified } = {}
        } = locationParams;

        return (
          <>
            <Form onSubmit={setLocationParams} initialValues={locationParams}>
              <Form.AutoSubmit onSubmit={values => setLocationParams(values)} />
              <Flex pt={5}>
                <Box px={5} width={1 / 2}>
                  <Trans
                    id="Enter division name"
                    render={({ translation }) => (
                      <Field.Text
                        name="filter.divisionFilter.name"
                        label={<Trans>Find division</Trans>}
                        placeholder={translation}
                        postfix={<SearchIcon color="silverCity" />}
                      />
                    )}
                  />
                </Box>
                <Box px={1} width={1 / 4}>
                  <Trans
                    id="Select option"
                    render={({ translation }) => (
                      <Field.Select
                        name="filter.dlsVerified"
                        label={<Trans>DLS Verification</Trans>}
                        items={Object.keys(STATUSES.YES_NO)}
                        itemToString={item =>
                          STATUSES.YES_NO[item] || translation
                        }
                        variant="select"
                        emptyOption
                      />
                    )}
                  />
                </Box>
              </Flex>
            </Form>
            <Query
              query={LegalEntityQuery}
              variables={{
                id,
                firstDivisions:
                  !first && !last
                    ? ITEMS_PER_PAGE[0]
                    : first
                      ? parseInt(first)
                      : undefined,
                lastDivisions: last ? parseInt(last) : undefined,
                beforeDivisions: before,
                afterDivisions: after,
                firstMergedFromLegalEntities: ITEMS_PER_PAGE[0],
                divisionFilter: {
                  ...divisionFilter,
                  dlsVerified: convertStringToBoolean(dlsVerified)
                }
              }}
            >
              {({
                loading,
                error,
                data: {
                  legalEntity: {
                    divisions: { nodes: divisions, pageInfo } = {}
                  } = {}
                } = {}
              }) => {
                if (!divisions) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {divisions.length > 0 ? (
                      <>
                        <Table
                          data={divisions}
                          header={{
                            name: <Trans>Legal entity name</Trans>,
                            addresses: <Trans>Address</Trans>,
                            mountainGroup: <Trans>Mountain region</Trans>,
                            phones: <Trans>Phone</Trans>,
                            email: <Trans>Email</Trans>,
                            dlsVerified: <Trans>DLS Verification</Trans>,
                            status: <Trans>Status</Trans>
                          }}
                          renderRow={({
                            mountainGroup,
                            addresses,
                            phones,
                            status,
                            dlsVerified,
                            ...props
                          }) => ({
                            ...props,
                            mountainGroup: (
                              <Flex justifyContent="center">
                                {mountainGroup ? (
                                  <PositiveIcon />
                                ) : (
                                  <NegativeIcon />
                                )}
                              </Flex>
                            ),
                            dlsVerified: (
                              <Flex justifyContent="center">
                                {STATUSES.YES_NO[dlsVerified]}
                              </Flex>
                            ),
                            addresses: addresses
                              .filter(a => a.type === "RESIDENCE")
                              .map((item, key) => (
                                <AddressView data={item} key={key} />
                              )),
                            phones: getPhones(phones),
                            status: (
                              <Badge
                                type="DIVISIONS"
                                name={status}
                                display="block"
                              />
                            )
                          })}
                        />
                        <Pagination {...pageInfo} />
                      </>
                    ) : (
                      <EmptyData />
                    )}
                  </LoadingOverlay>
                );
              }}
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Ability>
);

Divisions.fragments = {
  entry: gql`
    fragment LegalEntityDivisions on LegalEntity {
      divisions(
        first: $firstDivisions
        filter: $divisionFilter
        before: $beforeDivisions
        after: $afterDivisions
        last: $lastDivisions
      ) {
        nodes {
          id
          databaseId
          name
          addresses {
            ...Addresses
          }
          phones {
            type
            number
          }
          email
          status
          mountainGroup
          dlsVerified
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
    ${Pagination.fragments.entry}
    ${AddressView.fragments.entry}
  `
};

export default Divisions;
