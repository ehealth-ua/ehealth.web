//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";
import type { Scalars } from "@ehealth-ua/schema";

const Deactivate = ({
  id,
  navigate
}: {
  id: Scalars,
  navigate: string => mixed
}) => {
  const [isVisible, setVisibilityState] = React.useState(false);
  const toggle = () => setVisibilityState(!isVisible);

  return (
    <Mutation mutation={DeactivateLegalEntityMutation}>
      {deactivateLegalEntity => (
        <>
          <Button variant="red" onClick={toggle}>
            <Trans>Close legal entity</Trans>
          </Button>
          <Popup
            visible={isVisible}
            okButtonProps={{ type: "submit", variant: "red" }}
            onCancel={toggle}
            title={<Trans>Close legal entity</Trans>}
            onOk={async () => {
              await deactivateLegalEntity({
                variables: {
                  input: {
                    id
                  }
                }
              });
              await navigate("/legal-entity-deactivate-jobs/search");
            }}
          />
        </>
      )}
    </Mutation>
  );
};

const DeactivateLegalEntityMutation = gql`
  mutation DeactivateLegalEntityMutation($input: DeactivateLegalEntityInput!) {
    deactivateLegalEntity(input: $input) {
      legalEntityDeactivationJob {
        id
      }
    }
  }
`;

export default Deactivate;
