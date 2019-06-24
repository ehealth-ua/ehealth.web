//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";

import type { Scalars, ProgramMedication } from "@ehealth-ua/schema";

import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import DefinitionListView from "../../../components/DefinitionListView";

import UpdateProgramMedicationPopup from "./Mutations/Update";

const Header = ({
  id,
  databaseId,
  isActive,
  medicationRequestAllowed
}: {
  id: Scalars.ID,
  databaseId: Scalars.UUID,
  isActive: ProgramMedication.isActive,
  medicationRequestAllowed: ProgramMedication.medicationRequestAllowed
}) => (
  <Flex justifyContent="space-between" alignItems="flex-start">
    <Box>
      <DefinitionListView
        labels={{
          databaseId: <Trans>Participant ID</Trans>,
          isActive: <Trans>Status</Trans>,
          medicationRequestAllowed: <Trans>Medication request allowed</Trans>
        }}
        data={{
          databaseId,
          isActive: (
            <Badge
              type="ACTIVE_STATUS_M"
              name={isActive}
              variant={!isActive}
              minWidth={100}
            />
          ),
          medicationRequestAllowed: (
            <Badge
              type="MEDICATION_REQUEST_ALLOWED"
              name={medicationRequestAllowed}
              variant={!medicationRequestAllowed}
              minWidth={100}
            />
          )
        }}
        color="#7F8FA4"
        labelWidth="120px"
      />
    </Box>
    <Ability action="write" resource="program_medication">
      <UpdateProgramMedicationPopup
        id={id}
        isActive={isActive}
        medicationRequestAllowed={medicationRequestAllowed}
      />
    </Ability>
  </Flex>
);

Header.fragments = {
  entry: gql`
    fragment ProgramMedicationHeader on ProgramMedication {
      id
      databaseId
      isActive
      medicationRequestAllowed
    }
  `
};

export default Header;
