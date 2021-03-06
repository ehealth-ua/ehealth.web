//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import Composer from "react-composer";
import { Mutation } from "react-apollo";
import { Form, Validations, Validation } from "@ehealth/components";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";
import * as Field from "../../../components/Field";
import DictionaryValue from "../../../components/DictionaryValue";
import { CYRILLIC_MEDICAL_PROGRAM_NAME } from "../../../constants/validationPatterns";

const CreateMedicalProgramPopup = ({
  locationParams,
  medicalProgramsQuery
}: {
  locationParams: URLSearchParams,
  medicalProgramsQuery: DocumentNode
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={CreateMedicalProgramMutation}
        refetchQueries={() => [
          {
            query: medicalProgramsQuery,
            variables: locationParams
          }
        ]}
      >
        {createMedicalProgram => (
          <>
            <Button onClick={toggle} variant="green">
              <Trans>Add program</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={<Trans>Add new medical program</Trans>}
              okButtonProps={{ variant: "green" }}
              okText={<Trans>Add program</Trans>}
              justifyButtons="left"
              formId="createMedicalProgram"
            >
              <Form
                id="createMedicalProgram"
                onSubmit={async name => {
                  await createMedicalProgram({
                    variables: {
                      input: name
                    }
                  });
                  toggle();
                }}
              >
                <Trans
                  id="Enter program name"
                  render={({ translation }) => (
                    <Field.Text
                      name="name"
                      label={<Trans>Name</Trans>}
                      placeholder={translation}
                      maxLength={100}
                      showLengthHint
                    />
                  )}
                />
                <Validations field="name">
                  <Validation.Required message="Required field" />
                  <Validation.Matches
                    options={CYRILLIC_MEDICAL_PROGRAM_NAME}
                    message="Invalid name"
                  />
                </Validations>
                <Box width={3 / 5} mb={4}>
                  <Composer
                    components={[
                      <DictionaryValue name="MEDICAL_PROGRAM_TYPE" />,
                      ({ render }) => (
                        <Trans id="Select option" render={render} />
                      )
                    ]}
                  >
                    {([dict, { translation }]) => (
                      <Field.Select
                        name="type"
                        label={<Trans>Medical program type</Trans>}
                        placeholder={translation}
                        items={Object.keys(dict)}
                        itemToString={item => dict[item] || translation}
                        variant="select"
                        emptyOption
                      />
                    )}
                  </Composer>
                  <Validation.Required field="type" message="Required field" />
                </Box>
              </Form>
            </Popup>
          </>
        )}
      </Mutation>
    </Box>
  );
};

const CreateMedicalProgramMutation = gql`
  mutation CreateMedicalProgramMutation($input: CreateMedicalProgramInput!) {
    createMedicalProgram(input: $input) {
      medicalProgram {
        id
      }
    }
  }
`;

export default CreateMedicalProgramPopup;
