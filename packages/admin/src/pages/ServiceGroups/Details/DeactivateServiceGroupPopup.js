//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";

const DeactivateServiceGroupPopup = ({
  id,
  name,
  locationParams,
  serviceGroupDetailsQuery
}: {
  id: string,
  name: string,
  locationParams: URLSearchParams,
  serviceGroupDetailsQuery: DocumentNode
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Mutation
      mutation={DeactivateServiceGroupMutation}
      refetchQueries={() => [
        {
          query: serviceGroupDetailsQuery,
          variables: { id, ...locationParams }
        }
      ]}
    >
      {deactivateServiceGroup => (
        <>
          <Button onClick={toggle} variant="red">
            <Trans>Deactivate</Trans>
          </Button>
          <Popup
            visible={isPopupVisible}
            onCancel={toggle}
            title={
              <>
                <Trans>Deactivate group </Trans> "{name}
                "?
              </>
            }
            okText={<Trans>Deactivate</Trans>}
            onOk={async () => {
              await deactivateServiceGroup({
                variables: {
                  input: {
                    id
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

const DeactivateServiceGroupMutation = gql`
  mutation DeactivateServiceGroupMutation(
    $input: DeactivateServiceGroupInput!
  ) {
    deactivateServiceGroup(input: $input) {
      serviceGroup {
        id
      }
    }
  }
`;

export default DeactivateServiceGroupPopup;
