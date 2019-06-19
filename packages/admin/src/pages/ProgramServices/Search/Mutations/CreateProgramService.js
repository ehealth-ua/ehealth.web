//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import { Mutation } from "react-apollo";
import createDecorator from "final-form-calculate";
import { Form, Validation } from "@ehealth/components";
import { convertStringToBoolean, cleanDeep } from "@ehealth/utils";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import STATUSES from "../../../../helpers/statuses";
import * as Field from "../../../../components/Field";
import * as SearchField from "../../../../components/SearchField";

const CreateProgramService = ({
  searchProgramServicesQuery,
  locationParams
}: {
  searchProgramServicesQuery: DocumentNode,
  locationParams: URLSearchParams
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={CreateProgramServiceMutation}
        refetchQueries={() => [
          {
            query: searchProgramServicesQuery,
            variables: locationParams
          }
        ]}
      >
        {createProgramService => (
          <>
            <Button onClick={toggle} variant="green">
              <Trans>Create program service</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={<Trans>Create service group</Trans>}
              okButtonProps={{ variant: "green" }}
              justifyButtons="left"
              formId="createProgramService"
            >
              <Form
                id="createProgramService"
                onSubmit={async ({
                  medicalProgram,
                  consumerPrice,
                  isRequestAllowed,
                  service,
                  serviceGroup,
                  description
                }) => {
                  const requestAllowed = convertStringToBoolean(
                    isRequestAllowed
                  );
                  const price = parseInt(consumerPrice);

                  const createProgramServiceInput = cleanDeep({
                    medicalProgramId: medicalProgram && medicalProgram.id,
                    consumerPrice: price,
                    requestAllowed,
                    serviceId: service && service.id,
                    serviceGroupId: serviceGroup && serviceGroup.id,
                    description
                  });

                  await createProgramService({
                    variables: {
                      input: createProgramServiceInput
                    }
                  });
                  toggle();
                }}
                decorators={[resetServiceConnection]}
              >
                <SearchField.MedicalProgram name="medicalProgram" />
                <Validation.Required
                  field="medicalProgram"
                  message="Required field"
                />
                <Flex mx={-1}>
                  <Box px={1} width={1 / 2}>
                    <Field.Number
                      name="consumerPrice"
                      label={<Trans>Price</Trans>}
                      placeholder="0 - 1 000 000"
                      postfix={<Trans>uah</Trans>}
                    />
                    <Validation.Required
                      field="consumerPrice"
                      message="Required field"
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
                    <Validation.Required
                      field="isRequestAllowed"
                      message="Required field"
                    />
                  </Box>
                </Flex>
                <Flex mx={-1}>
                  <Box px={1} width={1 / 2}>
                    <SearchField.Service name="service" />
                  </Box>
                  <Box px={1} width={1 / 2}>
                    <SearchField.ServiceGroup name="serviceGroup" />
                  </Box>
                </Flex>
                <Trans
                  id="Enter description"
                  render={({ translation }) => (
                    <Field.Textarea
                      name="description"
                      placeholder={translation}
                      rows={5}
                      maxlength="3000"
                      showLengthHint
                    />
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

const CreateProgramServiceMutation = gql`
  mutation CreateProgramServiceMutation($input: CreateProgramServiceInput!) {
    createProgramService(input: $input) {
      programService {
        id
      }
    }
  }
`;

const resetServiceConnection = createDecorator(
  {
    field: "service",
    updates: {
      serviceGroup: (value, allValues) => {
        const { serviceGroup } = allValues || {};
        return value ? undefined : serviceGroup;
      }
    }
  },
  {
    field: "serviceGroup",
    updates: {
      service: (value, allValues) => {
        const { service } = allValues || {};
        return value ? undefined : service;
      }
    }
  }
);

export default CreateProgramService;
