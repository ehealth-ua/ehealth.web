//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";

import type { Scalars } from "@ehealth-ua/schema";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";

const DeactivateProgramServicePopup = ({ id }: { id: Scalars.ID }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Mutation mutation={DeactivateProgramServiceMutation}>
      {deactivateProgramService => (
        <>
          <Button onClick={toggle} variant="red">
            <Trans>Deactivate</Trans>
          </Button>
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                <Trans>Deactivate program service</Trans>?
              </>
            }
            okText={<Trans>Deactivate</Trans>}
            onOk={async () => {
              await deactivateProgramService({
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
  );
};

const DeactivateProgramServiceMutation = gql`
  mutation DeactivateProgramServiceMutation(
    $input: DeactivateProgramServiceInput!
  ) {
    deactivateProgramService(input: $input) {
      programService {
        id
        isActive
      }
    }
  }
`;

export default DeactivateProgramServicePopup;
