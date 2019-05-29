import React, { useState } from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";
import { Flex, Box } from "@rebass/emotion";
import { Query, Mutation } from "react-apollo";
import { Form, Validation } from "@ehealth/components";
import { convertStringToBoolean, cleanDeep } from "@ehealth/utils";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";
import STATUSES from "../../../helpers/statuses";
import * as Field from "../../../components/Field";

const CreateServiceGroupPopup = ({ locationParams, refetchQuery }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={CreateServiceGroupMutation}
        refetchQueries={() => [
          {
            query: refetchQuery,
            variables: locationParams
          }
        ]}
      >
        {createServiceGroup => (
          <>
            <Button onClick={toggle} variant="green">
              <Trans>Create service group</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={<Trans>Create service group</Trans>}
              okButtonProps={{ variant: "green" }}
              justifyButtons="left"
              formId="createServiceGroup"
            >
              <Form
                id="createServiceGroup"
                onSubmit={async ({ isRequestAllowed, ...input }) => {
                  const requestAllowed = convertStringToBoolean(
                    isRequestAllowed
                  );
                  const createServiceGroupInput = cleanDeep({
                    ...input,
                    requestAllowed,
                    parentGroupId: input.parentGroupId && input.parentGroupId.id
                  });

                  await createServiceGroup({
                    variables: {
                      input: createServiceGroupInput
                    }
                  });
                  toggle();
                }}
              >
                <Flex mx={-1}>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Enter group name"
                      render={({ translation }) => (
                        <Field.Text
                          name="name"
                          label={<Trans>Group name</Trans>}
                          placeholder={translation}
                          maxlength={100}
                          showLengthHint
                        />
                      )}
                    />
                    <Validation.Required
                      field="name"
                      message="Required field"
                    />
                  </Box>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Choose parent group"
                      render={({ translation }) => (
                        <Query
                          query={GetParentGroupQuery}
                          fetchPolicy="cache-first"
                          variables={{
                            skip: true
                          }}
                        >
                          {({
                            loading,
                            error,
                            data: {
                              serviceGroups: { nodes: serviceGroups = [] } = {}
                            } = {},
                            refetch: refetchServiceGroups
                          }) => (
                            <Field.Select
                              name="parentGroupId"
                              label={<Trans>Parent group (optional)</Trans>}
                              placeholder={translation}
                              items={serviceGroups.map(({ id, name }) => ({
                                id,
                                name
                              }))}
                              itemToString={item => item && item.name}
                              filter={serviceGroups => serviceGroups}
                              onInputValueChange={debounce(
                                (name, { selectedItem, inputValue }) =>
                                  !isEmpty(name) &&
                                  (selectedItem && selectedItem.name) !==
                                    inputValue &&
                                  refetchServiceGroups({
                                    skip: false,
                                    first: 20,
                                    filter: { name }
                                  }),
                                1000
                              )}
                            />
                          )}
                        </Query>
                      )}
                    />
                  </Box>
                </Flex>
                <Flex mx={-1} mb={4}>
                  <Box px={1} width={1 / 2}>
                    <Trans
                      id="Enter group code"
                      render={({ translation }) => (
                        <Field.Text
                          name="code"
                          label={<Trans>Group code</Trans>}
                          placeholder={translation}
                          maxlength={10}
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
              </Form>
            </Popup>
          </>
        )}
      </Mutation>
    </Box>
  );
};

const CreateServiceGroupMutation = gql`
  mutation CreateServiceGroupMutation($input: CreateServiceGroupInput!) {
    createServiceGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

const GetParentGroupQuery = gql`
  query GetParentGroupQuery(
    $first: Int
    $filter: ServiceGroupFilter
    $skip: Boolean! = false
  ) {
    serviceGroups(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
      }
    }
  }
`;

export default CreateServiceGroupPopup;
