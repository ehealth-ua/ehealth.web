//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Flex, Box } from "@rebass/emotion";

import type { Scalars, ProgramMedication } from "@ehealth-ua/schema";

import Button from "../../../../components/Button";

const UpdateProgramMedicationPopup = ({
  id,
  isActive,
  medicationRequestAllowed
}: {
  id: Scalars.ID,
  isActive: ProgramMedication.isActive,
  medicationRequestAllowed: ProgramMedication.medicationRequestAllowed
}) => (
  <Mutation mutation={UpdateProgramMedicationMutation}>
    {updateProgramMedication => (
      <Flex>
        <Box mr={2}>
          <Button
            variant={isActive ? "red" : "blue"}
            disabled={isActive && medicationRequestAllowed}
            onClick={async () => {
              await updateProgramMedication({
                variables: {
                  input: {
                    id,
                    isActive: !isActive
                  }
                }
              });
            }}
          >
            {isActive ? <Trans>Deactivate</Trans> : <Trans>Activate</Trans>}
          </Button>
        </Box>
        <Box>
          <Button
            disabled={!isActive}
            variant={medicationRequestAllowed ? "red" : "green"}
            onClick={async () => {
              await updateProgramMedication({
                variables: {
                  input: {
                    id,
                    medicationRequestAllowed: !medicationRequestAllowed
                  }
                }
              });
            }}
          >
            {medicationRequestAllowed ? (
              <Trans>Disallow Request</Trans>
            ) : (
              <Trans>Allow Request</Trans>
            )}
          </Button>
        </Box>
      </Flex>
    )}
  </Mutation>
);

export const UpdateProgramMedicationMutation = gql`
  mutation UpdateProgramMedicationMutation(
    $input: UpdateProgramMedicationInput!
  ) {
    updateProgramMedication(input: $input) {
      programMedication {
        id
        isActive
        medicationRequestAllowed
        reimbursement {
          reimbursementAmount
        }
      }
    }
  }
`;

export default UpdateProgramMedicationPopup;
