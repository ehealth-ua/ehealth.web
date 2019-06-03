import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";

const DeactivateServiceGroupPopup = ({ id, name, refetchQuery }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Mutation
      mutation={DeactivateServiceGroupMutation}
      refetchQueries={() => [
        {
          query: refetchQuery,
          variables: { id }
        }
      ]}
    >
      {deactivateServiceGroup => (
        <>
          <Button onClick={toggle} variant="red">
            <Trans>Deactivate</Trans>
          </Button>
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                <Trans>Deactivate group </Trans> "{name}
                "?
              </>
            }
            okText={<Trans>Deactivate</Trans>}
            onOk={async () => {
              await deactivateServiceGroup({
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

const DeactivateServiceGroupMutation = gql`
  mutation DeactivateServiceGroupMutation(
    $input: DeactivateServiceGroupInput!
  ) {
    deactivateServiceGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

export default DeactivateServiceGroupPopup;
