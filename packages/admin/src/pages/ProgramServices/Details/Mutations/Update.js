//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Form } from "@ehealth/components";

import type { Scalars, ProgramService } from "@ehealth-ua/schema";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import * as Field from "../../../../components/Field";

const UpdateServiceGroupPopup = ({
  id,
  requestAllowed,
  description
}: {
  id: Scalars.ID,
  requestAllowed: ProgramService.requestAllowed,
  description: ProgramService.description
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
            okButtonProps={{ type: "submit", variant: action.variant }}
            visible={isPopupVisible}
            onCancel={toggle}
            title={<>{action.description}?</>}
            okText={action.name}
            justifyButtons="left"
            formId="updateProgramService"
          >
            <Form
              id="updateProgramService"
              initialValues={{ description }}
              onSubmit={async ({ description = "" }) => {
                await updateProgramService({
                  variables: {
                    input: {
                      id,
                      description,
                      requestAllowed: !requestAllowed
                    }
                  }
                });
                toggle();
              }}
            >
              <Trans
                id="Enter description"
                render={({ translation }) => (
                  <Field.Textarea
                    name="description"
                    placeholder={translation}
                    rows={5}
                    maxLength="3000"
                    showLengthHint
                  />
                )}
              />
            </Form>
          </Popup>
        </>
      )}
    </Mutation>
  );
};

const UpdateProgramServiceMutation = gql`
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

export default UpdateServiceGroupPopup;
