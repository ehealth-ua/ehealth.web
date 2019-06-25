//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Form, Validation, Validations } from "@ehealth/components";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import * as Field from "../../../../components/Field";
import parseDigits from "../../../../helpers/parseDigits";
import {
  INNM_PATTERN,
  INNM_ORIGINAL_NAME_PATTERN,
  SCTID_PATTERN
} from "../../../../constants/validationPatterns";

const CreateINNMPopup = ({
  locationParams,
  searchINNMsQuery
}: {
  searchINNMsQuery: DocumentNode,
  locationParams: URLSearchParams
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={CreateINNMMutation}
        refetchQueries={() => [
          {
            query: searchINNMsQuery,
            variables: locationParams
          }
        ]}
      >
        {createINNM => (
          <>
            <Button onClick={toggle} variant="green">
              <Trans>Create INNM</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={<Trans>Create INNM</Trans>}
              formId="createINNM"
              okButtonProps={{ variant: "green" }}
              justifyButtons="left"
            >
              <Form
                id="createINNM"
                onSubmit={async input => {
                  await createINNM({
                    variables: { input }
                  });
                  toggle();
                }}
              >
                <Trans
                  id="Enter INNM"
                  render={({ translation }) => (
                    <Field.Text
                      name="name"
                      label={<Trans>INNM</Trans>}
                      placeholder={translation}
                      maxLength={100}
                      showLengthHint
                    />
                  )}
                />
                <Validations field="name">
                  <Validation.Required message="Required field" />
                  <Validation.Matches
                    options={INNM_PATTERN}
                    message="Invalid name"
                  />
                </Validations>
                <Trans
                  id="Enter original name"
                  render={({ translation }) => (
                    <>
                      <Field.Text
                        name="nameOriginal"
                        label={<Trans>INNM original name</Trans>}
                        placeholder={translation}
                        maxLength={100}
                        showLengthHint
                      />
                      <Validations field="nameOriginal">
                        <Validation.Required message="Required field" />
                        <Validation.Matches
                          options={INNM_ORIGINAL_NAME_PATTERN}
                          message="Invalid name"
                        />
                      </Validations>
                    </>
                  )}
                />
                <Trans
                  id="Enter SCTID"
                  render={({ translation }) => (
                    <>
                      <Field.Text
                        name="sctid"
                        label={<Trans>SCTID of INNM</Trans>}
                        placeholder={translation}
                        maxLength={8}
                        format={parseDigits}
                        showLengthHint
                      />
                      <Validations field="sctid">
                        <Validation.Required message="Required field" />
                        <Validation.Matches
                          options={SCTID_PATTERN}
                          message="Invalid SCTID"
                        />
                      </Validations>
                    </>
                  )}
                />
              </Form>
            </Popup>
          </>
        )}
      </Mutation>
    </Box>
  );
};

const CreateINNMMutation = gql`
  mutation CreateINNMMutation($input: CreateINNMInput!) {
    createINNM(input: $input) {
      innm {
        id
      }
    }
  }
`;

export default CreateINNMPopup;
