//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Text } from "@rebass/emotion";
import { Mutation } from "react-apollo";
import system from "@ehealth/system-components";
import type { ServiceGroupConnection } from "@ehealth-ua/schema";

import Popup from "../../../components/Popup";

const DeleteServiceFromGroupPopup = ({
  serviceId,
  serviceName,
  serviceGroupId,
  serviceGroupName,
  refetchQuery
}: {
  serviceId: string,
  serviceName: string,
  serviceGroupId: string,
  serviceGroupName: string,
  refetchQuery: ServiceGroupConnection
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Mutation
      mutation={DeleteServiceFromGroupPopupMutation}
      refetchQueries={() => [
        {
          query: refetchQuery,
          variables: {
            id: serviceGroupId
          }
        }
      ]}
    >
      {deleteServiceFromGroup => (
        <>
          <DeleteButton onClick={toggle}>
            <Trans>Delete</Trans>
          </DeleteButton>
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                <Trans>Delete service</Trans> "{serviceName}"{" "}
                <Trans>from service group</Trans> "{serviceGroupName}
                "?
              </>
            }
            okText={<Trans>Delete</Trans>}
            onOk={async () => {
              await deleteServiceFromGroup({
                variables: {
                  input: {
                    serviceId,
                    serviceGroupId
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

const DeleteServiceFromGroupPopupMutation = gql`
  mutation DeleteServiceFromGroupPopupMutation(
    $input: DeleteServiceFromGroupInput!
  ) {
    deleteServiceFromGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

const DeleteButton = system(
  {
    is: Text,
    color: "blueberrySoda",
    fontWeight: "bold",
    textAlign: "center"
  },
  {
    cursor: "pointer"
  },

  "color",
  "fontWeight",
  "textAlign"
);

export default DeleteServiceFromGroupPopup;
