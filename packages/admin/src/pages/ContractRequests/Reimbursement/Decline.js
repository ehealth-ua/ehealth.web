import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";

import { LocationParams, Form, Validation } from "@ehealth/components";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../../components/Line";
import Badge from "../../../components/Badge";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import * as Field from "../../../components/Field";
import DefinitionListView from "../../../components/DefinitionListView";

import env from "../../../env";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);
const DeclineContractRequestMutation = loader(
  "../../../graphql/DeclineContractRequestMutation.graphql"
);

const Decline = ({ id, location: { state }, ...props }) => {
  const { base } = state || {};
  return (
    <>
      <Box pt={5} px={5}>
        <Steps.List>
          <Steps.Item to="./" state={{ base }}>
            <Trans>Fill in fields</Trans>
          </Steps.Item>
          <Steps.Item to="./sign" state={{ base }} disabled={!base}>
            <Trans>Confirm with EDS</Trans>
          </Steps.Item>
        </Steps.List>
      </Box>
      <LocationParams>
        {({ locationParams, setLocationParams }) => (
          <Query query={ReimbursementContractRequestQuery} variables={{ id }}>
            {({ loading, error, data: { reimbursementContractRequest } }) => {
              if (isEmpty(reimbursementContractRequest)) return null;
              const {
                status,
                databaseId,
                contractorLegalEntity: {
                  databaseId: legalEntityId,
                  name,
                  edrpou
                }
              } = reimbursementContractRequest;

              return (
                <Box m={5}>
                  <OpacityBox>
                    <DefinitionListView
                      labels={{
                        databaseId: <Trans>Contract request ID</Trans>,
                        status: <Trans>Status</Trans>,
                        edrpou: <Trans>EDRPOU</Trans>,
                        name: <Trans>Name</Trans>,
                        legalEntityId: <Trans>Pharmacy ID</Trans>
                      }}
                      data={{
                        databaseId,
                        status: (
                          <Badge
                            name={status}
                            type="CONTRACT_REQUEST"
                            minWidth={100}
                          />
                        ),
                        edrpou,
                        name,
                        legalEntityId
                      }}
                      color="#7F8FA4"
                      labelWidth="100px"
                    />
                  </OpacityBox>
                  <Line />
                  <Router>
                    <Reason
                      path="/"
                      onSubmit={setLocationParams}
                      data={reimbursementContractRequest}
                    />
                    <Sign path="/sign" />
                  </Router>
                </Box>
              );
            }}
          </Query>
        )}
      </LocationParams>
    </>
  );
};

const Reason = ({ initialValues, navigate, location: { state } }) => {
  const { base } = state || {};
  return (
    <Flex>
      <Box width={460} pt={2}>
        <Form
          onSubmit={async ({ base }) => {
            navigate("./sign", { state: { base } });
          }}
          initialValues={{ base }}
        >
          <Trans
            id="Enter decline reason"
            render={({ translation }) => (
              <Field.Textarea
                name="base"
                rows={6}
                label={<Trans>Decline reason</Trans>}
                placeholder={translation}
                maxLength="3000"
                showLengthHint
              />
            )}
          />
          <Validation.Required field="base" message="Required field" />
          <Flex>
            <Box mr={3}>
              <Link to="../" state={base}>
                <Button variant="blue">
                  <Trans>Return</Trans>
                </Button>
              </Link>
            </Box>
            <Button variant="green" state={base}>
              <Trans>Next</Trans>
            </Button>
          </Flex>
        </Form>
      </Box>
    </Flex>
  );
};

const Sign = ({
  id,
  data,
  navigate,
  location: {
    state: { base }
  }
}) => (
  <Query query={ReimbursementContractRequestQuery} variables={{ id }}>
    {({
      loading,
      error,
      data: {
        reimbursementContractRequest: { toDeclineContent }
      }
    }) => (
      <Signer.Parent
        url={env.REACT_APP_SIGNER_URL}
        features={{ width: 640, height: 589 }}
      >
        {({ signData }) => (
          <Mutation
            mutation={DeclineContractRequestMutation}
            refetchQueries={() => [
              {
                query: ReimbursementContractRequestQuery,
                variables: { id }
              }
            ]}
          >
            {declineContractRequest => (
              <>
                <DefinitionListView
                  labels={{
                    base: <Trans>Decline reason</Trans>
                  }}
                  data={{
                    base
                  }}
                  labelWidth="300px"
                  marginBetween={2}
                  flexDirection="column"
                />
                <Flex mt={5}>
                  <Box mr={3}>
                    <Link to="../" state={{ base }}>
                      <Button variant="blue">
                        <Trans>Return</Trans>
                      </Button>
                    </Link>
                  </Box>
                  <Tooltip
                    component={() => (
                      <Button
                        variant="green"
                        onClick={async () => {
                          const { signedContent } = await signData({
                            ...toDeclineContent,
                            status_reason: base
                          });
                          await declineContractRequest({
                            variables: {
                              input: {
                                id,
                                signedContent: {
                                  content: signedContent,
                                  encoding: "BASE64"
                                }
                              }
                            }
                          });
                          await navigate("../../");
                        }}
                      >
                        <Trans>Approve by EDS</Trans>
                      </Button>
                    )}
                    content={toDeclineContent && toDeclineContent.text}
                  />
                </Flex>
              </>
            )}
          </Mutation>
        )}
      </Signer.Parent>
    )}
  </Query>
);

const OpacityBox = system({
  extend: Box,
  opacity: 0.5
});

export default Decline;
