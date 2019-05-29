import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box } from "@rebass/emotion";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";

const UpdateServiceGroupPopup = ({
  id,
  name,
  requestAllowed,
  refetchQuery
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  const action = requestAllowed
    ? {
        name: <Trans>Disallow Request</Trans>,
        description: <Trans>Disallow Request for group</Trans>,
        variant: "orange"
      }
    : {
        name: <Trans>Allow Request</Trans>,
        description: <Trans>Allow Request for group</Trans>,
        variant: "green"
      };

  return (
    <Mutation
      mutation={UpdateServiceGroupMutation}
      refetchQueries={() => [
        {
          query: refetchQuery,
          variables: { id, requestAllowed: !requestAllowed }
        }
      ]}
    >
      {updateServiceGroup => (
        <>
          <Button onClick={toggle} variant={action.variant}>
            {action.name}
          </Button>
          <Popup
            okButtonProps={{ type: "submit", variant: action.variant }}
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                {action.description} "{name}
                "?
              </>
            }
            okText={action.name}
            onOk={async () => {
              await updateServiceGroup({
                variables: {
                  input: {
                    id,
                    requestAllowed
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

const UpdateServiceGroupMutation = gql`
  mutation UpdateServiceGroupMutation($input: UpdateServiceGroupInput!) {
    updateServiceGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

export default UpdateServiceGroupPopup;
