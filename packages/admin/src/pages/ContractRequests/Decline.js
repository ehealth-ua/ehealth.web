import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";

import { LocationParams, Form, Validation } from "@ehealth/components";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../components/Line";
import Badge from "../../components/Badge";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import * as Field from "../../components/Field";
import DefinitionListView from "../../components/DefinitionListView";
import STATUSES from "../../helpers/statuses";

import ContractRequestQuery from "../../graphql/ContractRequestQuery.graphql";
import DeclineContractRequestMutation from "../../graphql/DeclineContractRequestMutation.graphql";

import { REACT_APP_SIGNER_URL } from "../../env";

const miscellaneous = STATUSES.CONTRACT_REQUEST_UPDATE_MISCELLANEOUS;

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
            Дозаповніть поля
          </Steps.Item>
          <Steps.Item to="./sign" state={{ base }} disabled={!base}>
            Підтвердіть з ЕЦП
          </Steps.Item>
        </Steps.List>
      </Box>
      <LocationParams>
        {({ locationParams, setLocationParams }) => (
          <Query query={ContractRequestQuery} variables={{ id }}>
            {({ loading, error, data: { contractRequest } }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;

              const {
                id,
                status,
                databaseId,
                contractorLegalEntity: { id: legalEntityId, name, edrpou }
              } = contractRequest;

              return (
                <Box m={5}>
                  <OpacityBox>
                    <DefinitionListView
                      labels={{
                        id: "ID запиту",
                        status: "Статус",
                        edrpou: "ЄДРПОУ",
                        name: "Назва",
                        legalEntityId: "ID медзакладу"
                      }}
                      data={{
                        id: databaseId,
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
                      data={contractRequest}
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
          <Field.Textarea
            name="base"
            rows={6}
            label="Причина відхилення"
            placeholder="Вкажіть причину відхилення"
          />
          <Validation.Required field="base" message="Обов&#700;язкове поле" />
          <Flex>
            <Box mr={3}>
              <Link to="../" state={base}>
                <Button variant="blue">Повернутися</Button>
              </Link>
            </Box>
            <Button variant="green" state={base}>
              Далі
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
  <Query query={ContractRequestQuery} variables={{ id }}>
    {({ loading, error, data: { contractRequest } }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      const {
        id,
        contractorLegalEntity: { id: legalEntityId, name, edrpou }
      } = contractRequest;

      return (
        <Signer.Parent
          url={REACT_APP_SIGNER_URL}
          features={{ width: 640, height: 589 }}
        >
          {({ signData }) => (
            <Mutation mutation={DeclineContractRequestMutation}>
              {declineContractRequest => (
                <>
                  <DefinitionListView
                    labels={{
                      base: "Причина відхилення"
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
                        <Button variant="blue">Повернутися</Button>
                      </Link>
                    </Box>
                    <Tooltip
                      component={() => (
                        <Button
                          variant="green"
                          onClick={async () => {
                            //TODO: check data for sign
                            const { signedContent } = await signData({
                              id,
                              contractorLegalEntity: {
                                id: legalEntityId,
                                name,
                                edrpou
                              },
                              nextStatus: "DECLINED",
                              statusReason: base,
                              text: miscellaneous
                            });
                            await declineContractRequest({
                              variables: {
                                input: {
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
                          Затвердити, наклавши ЕЦП
                        </Button>
                      )}
                      content={
                        <>
                          Увага! <br />
                          Затверджуючи запит, ПІДТВЕРДЖУЄТЕ дійсність власних
                          намірів , а також що зміст правочину ВІДПОВІДАЄ ВАШІЇЙ
                          ВОЛІ, ПРИЙНЯТИЙ ТА ПІДПИСАНИЙ ОСОБИСТО ВАМИ.
                        </>
                      }
                    />
                  </Flex>
                </>
              )}
            </Mutation>
          )}
        </Signer.Parent>
      );
    }}
  </Query>
);

const OpacityBox = system({
  is: Box,
  opacity: 0.5
});

export default Decline;