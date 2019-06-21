//@flow
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Form } from "@ehealth/components";
import { Box, Flex } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";
import { AdminAddIcon, SearchIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";
import * as Field from "../../../components/Field";
import Ability from "../../../components/Ability";
import Tooltip from "../../../components/Tooltip";
import EmptyData from "../../../components/EmptyData";
import Pagination from "../../../components/Pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import { LegalEntityQuery } from "./";
import type { Scalars, LegalEntity } from "@ehealth-ua/schema";

const RelatedLegalEntities = ({
  id,
  status,
  mergedToLegalEntity
}: {
  id: Scalars.ID,
  status: LegalEntity.status,
  mergedToLegalEntity: LegalEntity.mergedToLegalEntity
}) => (
  <Ability action="read" resource="related_legal_entities">
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { first, last, after, before, orderBy } = locationParams;
        return (
          <>
            <Flex justifyContent="space-between">
              <Box px={1}>
                <Form
                  onSubmit={setLocationParams}
                  initialValues={locationParams}
                >
                  <Box px={5} pt={5} width={460}>
                    <Trans
                      id="Enter legal entity EDRPOU"
                      render={({ translation }) => (
                        <Field.Text
                          name="filter.mergeLegalEntityFilter.mergedFromLegalEntity.edrpou"
                          label={<Trans>Find related legal entity</Trans>}
                          placeholder={translation}
                          postfix={<SearchIcon color="silverCity" />}
                        />
                      )}
                    />
                  </Box>
                </Form>
              </Box>
              <Box pt={5} pl={4} css={{ textAlign: "right" }}>
                {mergedToLegalEntity ? (
                  <Tooltip
                    placement="top"
                    content={
                      <Trans>Attention, legal entity was reorganized</Trans>
                    }
                    component={() => (
                      <Link
                        to={`../../${
                          mergedToLegalEntity.mergedToLegalEntity.id
                        }`}
                        fontWeight="bold"
                      >
                        <Trans>Go to the main legal entity</Trans>
                      </Link>
                    )}
                  />
                ) : status === "ACTIVE" ? (
                  <Link to="../add" fontWeight="bold">
                    <Flex mb={2}>
                      <Box mr={2}>
                        <AdminAddIcon width={16} height={16} />
                      </Box>{" "}
                      <Trans>Add related legal entity</Trans>
                    </Flex>
                  </Link>
                ) : null}
              </Box>
            </Flex>
            <Query
              query={LegalEntityQuery}
              fetchPolicy="network-only"
              variables={{
                id,
                firstMergedFromLegalEntities:
                  !first && !last
                    ? ITEMS_PER_PAGE[0]
                    : first
                      ? parseInt(first)
                      : undefined,
                lastMergedFromLegalEntities: last ? parseInt(last) : undefined,
                beforeMergedFromLegalEntities: before,
                afterMergedFromLegalEntities: after,
                firstDivisions: ITEMS_PER_PAGE[0]
              }}
            >
              {({
                loading,
                error,
                data: {
                  legalEntity: {
                    mergedFromLegalEntities: {
                      nodes: mergedFromLegalEntities,
                      pageInfo
                    } = {}
                  } = {}
                } = {}
              }) => {
                if (!mergedFromLegalEntities) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {mergedFromLegalEntities.length > 0 ? (
                      <>
                        <Table
                          data={mergedFromLegalEntities}
                          header={{
                            name: <Trans>Legal entity name</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            reason: <Trans>Basis</Trans>,
                            insertedAt: <Trans>Added</Trans>,
                            isActive: <Trans>Status</Trans>
                          }}
                          renderRow={({
                            reason,
                            insertedAt,
                            mergedFromLegalEntity: { edrpou, name },
                            isActive
                          }) => ({
                            reason,
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
                            name,
                            edrpou,
                            isActive: (
                              <Badge
                                name={isActive ? "ACTIVE" : "CLOSED"}
                                type="LEGALENTITY"
                                display="block"
                              />
                            )
                          })}
                          sortableFields={["insertedAt", "isActive"]}
                          sortingParams={parseSortingParams(orderBy)}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          tableName="mergedFromLegalEntities"
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

RelatedLegalEntities.fragments = {
  entry: gql`
    fragment RelatedLegalEntities on LegalEntity {
      mergedToLegalEntity {
        mergedToLegalEntity {
          id
        }
      }
      mergedFromLegalEntities(
        first: $firstMergedFromLegalEntities
        before: $beforeMergedFromLegalEntities
        after: $afterMergedFromLegalEntities
        last: $lastMergedFromLegalEntities
        filter: $mergeLegalEntityFilter
        orderBy: $orderByMergedFromLegalEntities
      ) {
        nodes {
          id
          isActive
          reason
          insertedAt
          mergedFromLegalEntity {
            id
            name
            edrpou
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
    ${Pagination.fragments.entry}
  `
};

export default RelatedLegalEntities;
