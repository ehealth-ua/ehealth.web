import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Flex, Box, Heading, Text } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import { convertStringToBoolean, cleanDeep } from "@ehealth/utils";

import Pagination from "../../../components/Pagination";
import SearchForm from "../../../components/SearchForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Button from "../../../components/Button";
import filteredLocationParams from "../../../helpers/filteredLocationParams";

import ProgramMedicationsTable from "./ProgramMedicationsTable";
import { PrimarySearchFields, SecondarySearchFields } from "./SearchFields";

const Search = ({ navigate }) => (
  <Box p={6}>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: {
            isActive,
            medicationRequestAllowed,
            medicalProgram,
            medication,
            ...params
          } = {}
        } = locationParams;

        const programMedicationsFilter = cleanDeep({
          ...params,
          medicalProgram: medicalProgram && {
            name: medicalProgram.name
          },
          medication: medication && {
            name: medication.name
          },
          isActive: convertStringToBoolean(isActive),
          medicationRequestAllowed: convertStringToBoolean(
            medicationRequestAllowed
          )
        });
        return (
          <>
            <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
              <Box>
                <Heading as="h1" fontWeight="normal" mb={4}>
                  <Trans>Program medications</Trans>
                </Heading>
                <Text fontSize={1}>
                  <Trans>
                    Manage a participant of medical program from the list below
                    or add the new one
                  </Trans>
                </Text>
              </Box>
              <Box>
                <Button onClick={() => navigate("../create")} variant="green">
                  <Trans>Add participant</Trans>
                </Button>
              </Box>
            </Flex>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              renderSecondary={SecondarySearchFields}
            />
            <Query
              query={SearchProgramMedicationsQuery}
              fetchPolicy="network-only"
              variables={{
                ...filteredLocationParams(locationParams),
                filter: programMedicationsFilter
              }}
            >
              {({ loading, data }) => {
                if (isEmpty(data)) return null;
                const {
                  nodes: programMedications = [],
                  pageInfo
                } = data.programMedications;
                return (
                  <LoadingOverlay loading={loading}>
                    {programMedications.length > 0 && (
                      <>
                        <ProgramMedicationsTable
                          locationParams={locationParams}
                          setLocationParams={setLocationParams}
                          programMedications={programMedications}
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

const SearchProgramMedicationsQuery = gql`
  query SearchProgramMedicationsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $filter: ProgramMedicationFilter
    $orderBy: ProgramMedicationOrderBy
  ) {
    programMedications(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) {
      nodes {
        ...ProgramMedications
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${ProgramMedicationsTable.fragments.entry}
  ${Pagination.fragments.entry}
`;

export default Search;
