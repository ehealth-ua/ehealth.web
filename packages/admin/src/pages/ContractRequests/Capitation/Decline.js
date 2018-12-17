import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../../components/Line";
import Badge from "../../../components/Badge";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Tooltip from "../../../components/Tooltip";
import * as Field from "../../../components/Field";
import DefinitionListView from "../../../components/DefinitionListView";

import env from "../../../env";

const CapitationContractRequestQuery = loader(
  "../../../graphql/CapitationContractRequestQuery.graphql"
);
const DeclineContractRequestMutation = loader(
  "../../../graphql/DeclineContractRequestMutation.graphql"
);

const Decline = ({
  id,
  location: {
    state: { base }
  },
  ...props
}) => {
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
          <Query query={CapitationContractRequestQuery} variables={{ id }}>
            {({
              loading,
              error,
              data: { capitationContractRequest = {} } = {}
            }) => {
              if (error) return `Error! ${error.message}`;

              const {
                status,
                databaseId,
                contractorLegalEntity: {
                  databaseId: legalEntityId,
                  name,
                  edrpou
                }
              } = capitationContractRequest;

              return (
                <LoadingOverlay loading={loading}>
                  <Box m={5}>
                    <OpacityBox>
                      <DefinitionListView
                        labels={{
                          databaseId: <Trans>Contract request ID</Trans>,
                          status: <Trans>Status</Trans>,
                          edrpou: <Trans>EDRPOU</Trans>,
                          name: <Trans>Name</Trans>,
                          legalEntityId: <Trans>Legal entity ID</Trans>
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
                        data={capitationContractRequest}
                      />
                      <Sign path="/sign" />
                    </Router>
                  </Box>
                </LoadingOverlay>
              );
            }}
          </Query>
        )}
      </LocationParams>
    </>
  );
};

const Reason = ({
  initialValues,
  navigate,
  location: {
    state: { base }
  }
}) => {
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
                maxlength="3000"
              />
            )}
          />
          <Validation.Required
            field="base"
            message={<Trans>Required field</Trans>}
          />
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
  <Query query={CapitationContractRequestQuery} variables={{ id }}>
    {({
      loading,
      error,
      data: {
        capitationContractRequest: { toDeclineContent }
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
                query: CapitationContractRequestQuery,
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
                          navigate("../../");
                        }}
                      >
                        <Trans>Approve by EDS</Trans>
                      </Button>
                    )}
                    content={toDeclineContent.text}
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
  is: Box,
  opacity: 0.5
});

export default Decline;
