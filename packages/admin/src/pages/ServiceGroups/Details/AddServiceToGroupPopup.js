//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query, Mutation } from "react-apollo";
import { Form, Validation } from "@ehealth/components";
import { AdminAddIcon } from "@ehealth/icons";

import type { ServiceGroupConnection } from "@ehealth-ua/schema";

import Popup from "../../../components/Popup";
import * as Field from "../../../components/Field";
import { IconButton } from "../../../components/Button";

const AddServiceToGroupPopup = ({
  serviceGroupId,
  serviceGroupName,
  serviceGroupDetailsQuery
}: {
  serviceGroupId: string,
  serviceGroupName: string,
  serviceGroupDetailsQuery: ServiceGroupConnection
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading fontSize="1" fontWeight="normal" mt={2}>
          <Trans>Services in the group</Trans>
        </Heading>
        <IconButton
          pr={0}
          icon={() => <AdminAddIcon width={16} height={16} />}
          onClick={toggle}
        >
          <Trans>Add service to the group</Trans>
        </IconButton>
      </Flex>
      <Mutation
        mutation={AddServiceToGroupMutation}
        refetchQueries={() => [
          {
            query: serviceGroupDetailsQuery,
            variables: {
              id: serviceGroupId
            }
          }
        ]}
      >
        {addServiceToGroup => (
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                <Trans>Add service to the group</Trans> "{serviceGroupName}"
              </>
            }
            okButtonProps={{ variant: "green" }}
            okText={<Trans>Add service</Trans>}
            justifyButtons="left"
            formId="addServiceToGroup"
          >
            <Form
              id="addServiceToGroup"
              initialValues={{
                serviceGroupId
              }}
              onSubmit={async ({ service, ...input }) => {
                const { id } = service;
                await addServiceToGroup({
                  variables: {
                    input: {
                      ...input,
                      serviceId: id
                    }
                  }
                });
                toggle();
              }}
            >
              <Box>
                <Trans
                  id="Choose service"
                  render={({ translation }) => (
                    <Query
                      query={GetServicesQuery}
                      fetchPolicy="cache-first"
                      variables={{
                        skip: true
                      }}
                    >
                      {({
                        loading,
                        error,
                        data: { services: { nodes: services = [] } = {} } = {},
                        refetch: refetchServices
                      }) => (
                        <Field.Select
                          name="service"
                          label={<Trans>Service name</Trans>}
                          placeholder={translation}
                          items={services.map(({ id, name }) => ({
                            id,
                            name
                          }))}
                          itemToString={item => item && item.name}
                          filter={services => services}
                          onInputValueChange={debounce(
                            (name, { selectedItem, inputValue }) =>
                              !isEmpty(name) &&
                              (selectedItem && selectedItem.name) !==
                                inputValue &&
                              refetchServices({
                                skip: false,
                                first: 20,
                                filter: {
                                  name,
                                  isActive: true
                                }
                              }),
                            1000
                          )}
                        />
                      )}
                    </Query>
                  )}
                />
                <Validation.Required field="service" message="Required field" />
              </Box>
            </Form>
          </Popup>
        )}
      </Mutation>
    </Box>
  );
};

const AddServiceToGroupMutation = gql`
  mutation AddServiceToGroupMutation($input: AddServiceToGroupInput!) {
    addServiceToGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

const GetServicesQuery = gql`
  query GetServicesQuery(
    $first: Int
    $filter: ServiceFilter
    $skip: Boolean! = false
  ) {
    services(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
      }
    }
  }
`;

export default AddServiceToGroupPopup;
