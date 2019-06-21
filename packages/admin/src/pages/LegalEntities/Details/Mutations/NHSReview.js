import React from "react";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import Button from "../../../../components/Button";
import gql from "graphql-tag";

import type { Scalars } from "@ehealth-ua/schema";

const NHSReview = ({ id }: { id: Scalars.ID }) => (
  <Mutation mutation={NhsReviewLegalEntityMutation}>
    {nhsReviewLegalEntity => (
      <Button
        onClick={async () => {
          await nhsReviewLegalEntity({
            variables: {
              input: {
                id
              }
            }
          });
        }}
        variant="blue"
      >
        <Trans>To process</Trans>
      </Button>
    )}
  </Mutation>
);

const NhsReviewLegalEntityMutation = gql`
  mutation NhsReviewLegalEntityMutation($input: NhsReviewLegalEntityInput!) {
    legalEntity: nhsReviewLegalEntity(input: $input) {
      legalEntity {
        id
        nhsReviewed
      }
    }
  }
`;

export default NHSReview;
