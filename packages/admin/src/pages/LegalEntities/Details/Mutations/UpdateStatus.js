//@flow
import * as React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Form, Validation } from "@ehealth/components";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import * as Field from "../../../../components/Field";
import type { Scalars } from "@ehealth-ua/schema";

const UpdateStatus = ({ id, isActive }: { id: Scalars, isActive: boolean }) => {
  const variant: string = isActive ? "orange" : "green";
  const status: string = isActive ? "SUSPENDED" : "ACTIVE";

  const [isVisible, setVisibilityState] = React.useState(false);
  const toggle = () => setVisibilityState(!isVisible);

  return (
    <Mutation mutation={UpdateLegalEntityStatusMutation}>
      {updateLegalEntityStatus => (
        <>
          <UpdateButton toggle={toggle} variant={variant} isActive={isActive} />
          <Popup
            visible={isVisible}
            okButtonProps={{ type: "submit", variant }}
            onCancel={toggle}
            title={<Title isActive={isActive} />}
            formId="updateLegalEntityStatusForm"
            justifyButtons="left"
          >
            <Form
              onSubmit={async ({ reason }) => {
                await updateLegalEntityStatus({
                  variables: { input: { id, reason, status } }
                });
                toggle();
              }}
              id="updateLegalEntityStatusForm"
            >
              <Trans
                id="Enter reason comment"
                render={({ translation }) => (
                  <Field.Textarea
                    name="reason"
                    placeholder={translation}
                    rows={5}
                    maxLength="3000"
                    showLengthHint
                  />
                )}
              />
              <Validation.Required field="reason" message="Required field" />
            </Form>
          </Popup>
        </>
      )}
    </Mutation>
  );
};

const UpdateButton = ({
  variant,
  toggle,
  isActive
}: {
  variant: string,
  toggle: () => mixed,
  isActive: boolean
}) => (
  <Button variant={variant} onClick={toggle}>
    <Title isActive={isActive} />
  </Button>
);

const Title = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <Trans>Suspend Legal Entity</Trans>
  ) : (
    <Trans>Activate Legal Entity</Trans>
  );

const UpdateLegalEntityStatusMutation = gql`
  mutation UpdateLegalEntityStatusMutation(
    $input: UpdateLegalEntityStatusInput!
  ) {
    updateLegalEntityStatus(input: $input) {
      legalEntity {
        id
        status
        nhsReviewed
      }
    }
  }
`;

export default UpdateStatus;
