//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import Popup from "../../../../components/Popup";
import Button from "../../../../components/Button";

import type { Scalars, LegalEntity } from "@ehealth-ua/schema";

const NHSVerify = ({
  id,
  nhsVerified,
  isVerificationActive
}: {
  id: Scalars.ID,
  nhsVerified: LegalEntity.nhsVerified,
  isVerificationActive: boolean
}) => {
  const [isVisible, setVisibilityState] = React.useState(false);
  const toggle = () => setVisibilityState(!isVisible);
  const variant: string = nhsVerified ? "red" : "green";
  return (
    <Mutation mutation={NhsVerifyLegalEntityMutation}>
      {nhsVerifyLegalEntity => (
        <>
          <NHSVerifyButton
            nhsVerified={nhsVerified}
            variant={variant}
            toggle={toggle}
          />
          <Popup
            visible={isVisible}
            okButtonProps={{
              variant,
              disabled: !isVerificationActive
            }}
            onCancel={toggle}
            title={<Title nhsVerified={nhsVerified} />}
            onOk={async () => {
              await nhsVerifyLegalEntity({
                variables: {
                  input: {
                    id,
                    nhsVerified: !nhsVerified
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

const Title = ({ nhsVerified }: { nhsVerified: LegalEntity.nhsVerified }) =>
  nhsVerified ? (
    <Trans>Cancel Verification</Trans>
  ) : (
    <Trans>Verification legal entity</Trans>
  );

const NHSVerifyButton = ({
  nhsVerified,
  toggle,
  variant
}: {
  nhsVerified: LegalEntity.nhsVerified,
  toggle: () => mixed,
  variant: string
}) => (
  <Button variant={variant} onClick={toggle}>
    <Title nhsVerified={nhsVerified} />
  </Button>
);

const NhsVerifyLegalEntityMutation = gql`
  mutation NhsVerifyLegalEntityMutation($input: NhsVerifyLegalEntityInput!) {
    legalEntity: nhsVerifyLegalEntity(input: $input) {
      legalEntity {
        id
        nhsVerified
      }
    }
  }
`;

export default NHSVerify;
