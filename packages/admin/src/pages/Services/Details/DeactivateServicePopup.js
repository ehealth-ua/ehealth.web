//@flow
import React, { useState } from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box } from "@rebass/emotion";

import type { DocumentNode } from "graphql";
import type { URLSearchParams } from "@ehealth/components";

import Popup from "../../../components/Popup";
import Button from "../../../components/Button";

const DeactivateServicePopup = ({
  id,
  name,
  locationParams,
  serviceDetailsQuery
}: {
  id: string,
  name: string,
  locationParams: URLSearchParams,
  serviceDetailsQuery: DocumentNode
}) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isPopupVisible);

  return (
    <Box>
      <Mutation
        mutation={DeactivateServiceMutation}
        refetchQueries={() => [
          {
            query: serviceDetailsQuery,
            variables: { id, ...locationParams }
          }
        ]}
      >
        {deactivateService => (
          <>
            <Button onClick={toggle} variant="red">
              <Trans>Deactivate</Trans>
            </Button>
            <Popup
              visible={isPopupVisible}
              onCancel={toggle}
              title={
                <>
                  <Trans>Deactivate</Trans> "{name}
                  "?
                </>
              }
              okText={<Trans>Deactivate</Trans>}
              onOk={async () => {
                await deactivateService({
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
    </Box>
  );
};

const DeactivateServiceMutation = gql`
  mutation DeactivateServiceMutation($input: DeactivateServiceInput!) {
    deactivateService(input: $input) {
      service {
        id
      }
    }
  }
`;

export default DeactivateServicePopup;
