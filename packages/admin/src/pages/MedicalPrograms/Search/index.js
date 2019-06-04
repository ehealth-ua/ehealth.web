import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";
import { Flex, Box, Heading, Text } from "@rebass/emotion";

import Ability from "../../../components/Ability";
import SearchForm from "../../../components/SearchForm";
import Pagination from "../../../components/Pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

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
                    medicalProgramsQuery={MedicalProgramsQuery}
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

const MedicalProgramsQuery = gql`
  query MedicalProgramsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: MedicalProgramFilter
    $orderBy: MedicalProgramOrderBy
    $skip: Boolean! = false
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
