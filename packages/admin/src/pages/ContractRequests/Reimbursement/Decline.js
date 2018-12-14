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
            <Trans>Дозаповніть поля</Trans>
          </Steps.Item>
          <Steps.Item to="./sign" state={{ base }} disabled={!base}>
            <Trans>Підтвердіть з ЕЦП</Trans>
          </Steps.Item>
        </Steps.List>
      </Box>
      <LocationParams>
        {({ locationParams, setLocationParams }) => (
          <Query query={ReimbursementContractRequestQuery} variables={{ id }}>
            {({ loading, error, data: { reimbursementContractRequest } }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;

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
                        databaseId: <Trans>ID заяви</Trans>,
                        status: <Trans>Статус</Trans>,
                        edrpou: <Trans>ЄДРПОУ</Trans>,
                        name: <Trans>Назва</Trans>,
                        legalEntityId: <Trans>ID аптеки</Trans>
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
            id="Вкажіть причину відхилення"
            render={({ translate: translate }) => (
              <Field.Textarea
                name="base"
                rows={6}
                label={<Trans>Причина відхилення</Trans>}
                placeholder={translate}
                maxlength="3000"
              />
            )}
          />
          <Validation.Required
            field="base"
            message={<Trans>Обовʼязкове поле</Trans>}
          />
          <Flex>
            <Box mr={3}>
              <Link to="../" state={base}>
                <Button variant="blue">
                  <Trans>Повернутися</Trans>
                </Button>
              </Link>
            </Box>
            <Button variant="green" state={base}>
              <Trans>Далі</Trans>
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
                    base: <Trans>Причина відхилення</Trans>
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
                        <Trans>Повернутися</Trans>
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
                        <Trans>Затвердити, наклавши ЕЦП</Trans>
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
  is: Box,
  opacity: 0.5
});

export default Decline;
