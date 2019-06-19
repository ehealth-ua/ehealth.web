import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import Composer from "react-composer";
import { Mutation } from "react-apollo";
import { Flex, Box } from "@rebass/emotion";
import { Form, Validation } from "@ehealth/components";
import { convertStringToBoolean } from "@ehealth/utils";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";
import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";
import DictionaryValue from "../../../components/DictionaryValue";

const CreateServicePopup = ({ locationParams, refetchQuery }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={CreateServiceMutation}
        refetchQueries={() => [
          {
            query: refetchQuery,
            variables: locationParams
          }
        ]}
      >
        {createService => (
          <>
            <Button onClick={toggle} variant="green">
              <Trans>Create service</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={<Trans>Create service</Trans>}
              okButtonProps={{ variant: "green" }}
              justifyButtons="left"
              formId="createService"
            >
              <Form
                id="createService"
                onSubmit={async ({ isRequestAllowed, ...input }) => {
                  const requestAllowed = convertStringToBoolean(
                    isRequestAllowed
                  );
                  await createService({
                    variables: {
                      input: { ...input, requestAllowed }
                    }
                  });
                  toggle();
                }}
              >
                <Flex mx={-1}>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Enter service name"
                      render={({ translation }) => (
                        <Field.Text
                          name="name"
                          label={<Trans>Service name</Trans>}
                          placeholder={translation}
                          maxLength={100}
                          showLengthHint
                        />
                      )}
                    />
                  </Box>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Select option"
                      render={({ translation }) => (
                        <Field.Select
                          name="isRequestAllowed"
                          label={<Trans>Is request allowed</Trans>}
                          items={Object.keys(STATUSES.YES_NO)}
                          itemToString={item =>
                            STATUSES.YES_NO[item] || translation
                          }
                          variant="select"
                          emptyOption
                        />
                      )}
                    />
                  </Box>
                </Flex>
                <Validation.Required field="name" message="Required field" />
                <Flex mx={-1}>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Enter service code"
                      render={({ translation }) => (
                        <Field.Text
                          name="code"
                          label={<Trans>Service code</Trans>}
                          placeholder={translation}
                          maxLength={10}
                          showLengthHint
                        />
                      )}
                    />
                    <Validation.Required
                      field="code"
                      message="Required field"
                    />
                  </Box>
                  <Box px={1} width={1 / 2}>
                    <Composer
                      components={[
                        <DictionaryValue name="SERVICE_CATEGORY" />,
                        ({ render }) => (
                          <Trans id="Select option" render={render} />
                        )
                      ]}
                    >
                      {([dict, { translation }]) => (
                        <Field.Select
                          name="category"
                          label={<Trans>Service category</Trans>}
                          placeholder={translation}
                          items={Object.keys(dict)}
                          itemToString={item => dict[item] || translation}
                          variant="select"
                          emptyOption
                        />
                      )}
                    </Composer>
                  </Box>
                </Flex>
              </Form>
            </Popup>
          </>
        )}
      </Mutation>
    </Box>
  );
};

const CreateServiceMutation = gql`
  mutation CreateServiceMutation($input: CreateServiceInput!) {
    createService(input: $input) {
      service {
        id
      }
    }
  }
`;

export default CreateServicePopup;
