//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Box, Flex } from "@rebass/emotion";
import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import DefinitionListView from "../../../components/DefinitionListView";

import NHSReview from "./Mutations/NHSReview";
import UpdateStatus from "./Mutations/UpdateStatus";
import Deactivate from "./Mutations/Deactivate";

import type { Scalars, LegalEntity } from "@ehealth-ua/schema";

const Header = ({
  id,
  databaseId,
  edrData,
  status,
  nhsReviewed,
  name,
  navigate
}: {
  id: Scalars.ID,
  databaseId: Scalars.UUID,
  edrData: LegalEntity.edrData,
  status: LegalEntity.status,
  nhsReviewed: LegalEntity.nhsReviewed,
  name: LegalEntity.name,
  navigate: string => mixed
}) => {
  const isProcessingActive = status !== "CLOSED" && status !== "REORGANISED";
  return (
    <Flex justifyContent="space-between" alignItems="flex-end">
      <Box>
        <DefinitionListView
          labels={{
            databaseId: <Trans>Legal entity ID</Trans>,
            name: <Trans>Name</Trans>,
            status: <Trans>Status</Trans>
          }}
          data={{
            databaseId,
            name: (edrData && edrData.name) || name,
            status: <Badge name={status} type="LEGALENTITY" minWidth={100} />
          }}
          color="#7F8FA4"
          labelWidth="120px"
        />
      </Box>
      {isProcessingActive &&
        (!nhsReviewed ? (
          <Ability action="nhs_verify" resource="legal_entity">
            <NHSReview id={id} />
          </Ability>
        ) : (
          <Flex justifyContent="flex-end" flexWrap="wrap">
            <Ability action="update" resource="legal_entity">
              <Box mt={2}>
                <UpdateStatus id={id} isActive={status === "ACTIVE"} />
              </Box>
            </Ability>
            <Ability action="deactivate" resource="legal_entity">
              <Box mt={2} ml={2}>
                <Deactivate id={id} navigate={navigate} />
              </Box>
            </Ability>
          </Flex>
        ))}
    </Flex>
  );
};

Header.fragments = {
  entry: gql`
    fragment LegalEntityHeader on LegalEntity {
      id
      databaseId
      edrData {
        databaseId
        edrId
        edrpou
        insertedAt
        isActive
        kveds {
          code
          isPrimary
        }
        legalForm
        name
        publicName
        registrationAddress {
          address
        }
        shortName
        state
        updatedAt
      }
      status
      nhsReviewed
      nhsVerified
      name
    }
  `
};

export default Header;
