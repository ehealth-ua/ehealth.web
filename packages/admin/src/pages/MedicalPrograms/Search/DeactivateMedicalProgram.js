//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { ifProp } from "styled-tools";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box, Text } from "@rebass/emotion";
import { mixed } from "@ehealth/system-tools";
import system from "@ehealth/system-components";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../components/Popup";

const DeactivateMedicalProgram = ({
  id,
  name,
  locationParams,
  isActive,
  medicalProgramsQuery
}: {
  id: string,
  name: string,
  locationParams: URLSearchParams,
  isActive: boolean,
  medicalProgramsQuery: DocumentNode
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={DeactivateMedicalProgramMutation}
        refetchQueries={() => [
          {
            query: medicalProgramsQuery,
            variables: locationParams
          }
        ]}
      >
        {deactivateMedicalProgram => (
          <>
            <DeactivateButton
              onClick={toggle}
              disabled={!isActive}
              variant="green"
            >
              <Trans>Deactivate</Trans>
            </DeactivateButton>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={
                <>
                  <Trans>Deactivate medical program</Trans> "{name}" ?
                </>
              }
              okText={<Trans>Deactivate</Trans>}
              onOk={async () => {
                await deactivateMedicalProgram({
                  variables: {
                    input: {
                      id
                    }
                  }
                });
                toggle();
              }}
            />
          </>
        )}
      </Mutation>
    </Box>
  );
};

const DeactivateButton = system(
  {
    is: Text
  },
  props =>
    mixed({
      cursor: ifProp("disabled", "not-allowed", "pointer")(props),
      fontWeight: "bold",
      color: ifProp("disabled", "januaryDawn", "rockmanBlue")(props)
    })
);

const DeactivateMedicalProgramMutation = gql`
  mutation DeactivateMedicalProgramMutation(
    $input: DeactivateMedicalProgramInput!
  ) {
    deactivateMedicalProgram(input: $input) {
      medicalProgram {
        id
      }
    }
  }
`;

export default DeactivateMedicalProgram;
