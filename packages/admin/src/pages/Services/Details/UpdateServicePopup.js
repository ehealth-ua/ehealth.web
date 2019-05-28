import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box } from "@rebass/emotion";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";

const UpdateServicePopup = ({ id, name, requestAllowed, refetchQuery }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  const action = requestAllowed
    ? {
        name: <Trans>Disallow Request</Trans>,
        variant: "orange"
      }
    : {
        name: <Trans>Allow Request</Trans>,
        variant: "green"
      };

  return (
    <Box>
      <Mutation
        mutation={UpdateServiceMutation}
        refetchQueries={() => [
          {
            query: refetchQuery,
            variables: { id, requestAllowed: !requestAllowed }
          }
        ]}
      >
        {updateService => (
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
                  {action.name} "{name}
                  "?
                </>
              }
              okText={action.name}
              onOk={async () => {
                await updateService({
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

const UpdateServiceMutation = gql`
  mutation UpdateServiceMutation($input: UpdateServiceInput!) {
    updateService(input: $input) {
      service {
        id
      }
    }
  }
`;

export default UpdateServicePopup;
