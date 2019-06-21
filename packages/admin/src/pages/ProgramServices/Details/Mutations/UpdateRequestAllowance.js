//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";

import type { Scalars, ProgramService } from "@ehealth-ua/schema";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";

const UpdateProgramServiceRequestAllowance = ({
  id,
  requestAllowed
}: {
  id: Scalars.ID,
  requestAllowed: ProgramService.requestAllowed
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  const action = requestAllowed
    ? {
        name: <Trans>Disallow Request</Trans>,
        description: <Trans>Disallow Request for program service</Trans>,
        variant: "orange"
      }
    : {
        name: <Trans>Allow Request</Trans>,
        description: <Trans>Allow Request for program service</Trans>,
        variant: "green"
      };

  return (
    <Mutation mutation={UpdateProgramServiceMutation}>
      {updateProgramService => (
        <>
          <Button onClick={toggle} variant={action.variant}>
            {action.name}
          </Button>
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={<>{action.description}?</>}
            okText={action.name}
            onOk={async () => {
              await updateProgramService({
                variables: {
                  input: {
                    id,
                    requestAllowed: !requestAllowed
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

export const UpdateProgramServiceMutation = gql`
  mutation UpdateProgramServiceMutation($input: UpdateProgramServiceInput!) {
    updateProgramService(input: $input) {
      programService {
        id
        description
        requestAllowed
      }
    }
  }
`;

export default UpdateProgramServiceRequestAllowance;
