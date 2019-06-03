import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { Flex, Box, Heading, Text } from "@rebass/emotion";

import { LocationParams } from "@ehealth/components";
import { convertStringToBoolean } from "@ehealth/utils";

import Ability from "../../../components/Ability";
import SearchForm from "../../../components/SearchForm";
import Pagination from "../../../components/Pagination";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { PrimarySearchFields } from "./SearchFields";
import MedicalProgramsTable from "./MedicalProgramsTable";
import CreateMedicalProgramPopup from "./CreateMedicalProgramPopup";

const Search = () => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const filteredParams = filteredLocationParams(locationParams);
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
                <Ability action="write" resource="medical_program">
                  <CreateMedicalProgramPopup
                    locationParams={filteredParams}
                    refetchQuery={MedicalProgramsQuery}
                  />
                </Ability>
              </Box>
            </Flex>
            <SearchForm
              initialValues={filteredParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
            />
            <Query
              query={MedicalProgramsQuery}
              fetchPolicy="network-only"
              variables={filteredParams}
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
                    <MedicalProgramsTable
                      locationParams={filteredParams}
                      setLocationParams={setLocationParams}
                      medicalPrograms={medicalPrograms}
                      medicalProgramsQuery={MedicalProgramsQuery}
                    />
                    <Pagination {...pageInfo} />
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

const MedicalProgramsQuery = gql`
  query MedicalProgramsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: MedicalProgramFilter
    $orderBy: MedicalProgramOrderBy
    $skip: Boolean!
  ) {
    medicalPrograms(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) @skip(if: $skip) {
      nodes {
        ...MedicalPrograms
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${MedicalProgramsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;
