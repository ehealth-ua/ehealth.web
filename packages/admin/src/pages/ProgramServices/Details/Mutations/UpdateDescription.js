//@flow
import React, { useState } from "react";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Form } from "@ehealth/components";
import { Text } from "@rebass/emotion";

import type { Scalars, ProgramService } from "@ehealth-ua/schema";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import * as Field from "../../../../components/Field";

import { UpdateProgramServiceMutation } from "./UpdateRequestAllowance";

const UpdateProgramServiceDescription = ({
  id,
  description
}: {
  id: Scalars.ID,
  description: ProgramService.description
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Mutation mutation={UpdateProgramServiceMutation}>
      {updateProgramService => (
        <>
          <UpdateButton toggle={toggle} description={description} />
          <Popup
            okButtonProps={{ variant: "green" }}
            visible={isPopupVisible}
            onCancel={toggle}
            title={<Trans>Description</Trans>}
            okText={<Title description={description} />}
            justifyButtons="left"
            formId="updateProgramServiceDescription"
          >
            <Form
              id="updateProgramServiceDescription"
              initialValues={{ description }}
              onSubmit={async ({ description = "" }) => {
                await updateProgramService({
                  variables: {
                    input: {
                      id,
                      description
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

const UpdateButton = ({ toggle, description }) => (
  <Button variant="none" border="none" px="0" py="0" onClick={toggle}>
    <Text
      fontSize={0}
      color="rockmanBlue"
      fontWeight="bold"
      ml={description ? 2 : 0}
    >
      <Title description={description} />
    </Text>
  </Button>
);

const Title = ({ description }) =>
  description ? <Trans>Change</Trans> : <Trans>Add</Trans>;

export default UpdateProgramServiceDescription;
