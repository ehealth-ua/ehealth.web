import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";

import {
  LocationParams,
  Form,
  Validation,
  Validations
} from "@ehealth/components";
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
import UpdateContractRequestMutation from "../../graphql/UpdateContractRequestMutation.graphql";
import ApproveContractRequestMutation from "../../graphql/ApproveContractRequestMutation.graphql";

import { REACT_APP_SIGNER_URL } from "../../env";

const nhsPaymentMethod = Object.entries(STATUSES.NHS_PAYMENT_METHOD).map(
  ([key, value]) => ({ key, value })
);
const miscellaneous = STATUSES.CONTRACT_REQUEST_UPDATE_MISCELLANEOUS;

const Approve = ({ id, ...props }) => {
  return (
    <>
      <Box pt={5} px={5}>
        <Steps.List>
          <Steps.Item to="./">Дозаповніть поля</Steps.Item>
          <Steps.Item to="./check">Підтвердіть з ЕЦП</Steps.Item>
        </Steps.List>
      </Box>
      <LocationParams>
        {({ locationParams, setLocationParams }) => (
          <Query
            query={ContractRequestQuery}
            variables={{
              id
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const { contractRequest } = data;
              const {
                id,
                status,
                databaseId,
                contractorLegalEntity: { id: legalEntityId, name, edrpou },
                issueCity,
                nhsContractPrice,
                nhsPaymentMethod,
                nhsSignerBase,
                nhsSigner: { id: nhsSignerId }
              } = contractRequest;

              return (
                <>
                  <OpacityBox m={5}>
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
                  <Router>
                    <Additional
                      path="/"
                      initialValues={{
                        nhsSignerBase,
                        nhsSignerId,
                        issueCity,
                        nhsContractPrice,
                        nhsPaymentMethod
                      }}
                      onSubmit={setLocationParams}
                      data={contractRequest}
                    />
                    <Checking path="/check" />
                  </Router>
                </>
              );
            }}
          </Query>
        )}
      </LocationParams>
    </>
  );
};

const Additional = ({
  onSubmit: setLocationParams,
  initialValues,
  navigate,
  ...props
}) => {
  const [initialNhsPaymentMethod] = nhsPaymentMethod.filter(
    ({ key }) => key !== initialValues.nhsPaymentMethod
  );
  return (
    <Box m={5}>
      <Form
        onSubmit={() => {}}
        initialValues={{
          ...initialValues,
          nhsPaymentMethod: initialNhsPaymentMethod
        }}
      >
        <Form.AutoSubmit
          onSubmit={({ nhsPaymentMethod: { key } = {}, ...values }) =>
            setLocationParams({
              ...values,
              nhsPaymentMethod: key
            })
          }
        />
        <Flex>
          <Box mr={5} width={2 / 5}>
            <Field.Text
              name="nhsSignerId"
              label="Підписант зі сторони Замовника"
              placeholder="Введіть підписанта"
            />
            <Validation.Required
              field="nhsSignerId"
              message="Обов&#700;язкове поле"
            />
          </Box>
          <Box width={2 / 5}>
            <Field.Text
              name="nhsSignerBase"
              label="Що діє на підставі"
              placeholder="Оберіть підставу"
            />
            <Validation.Required
              field="nhsSignerBase"
              message="Обов&#700;язкове поле"
            />
          </Box>
        </Flex>
        <Flex>
          <Box mr={5} width={2 / 5}>
            <Field.Number
              name="nhsContractPrice"
              label="Сума контракту"
              placeholder="1 - 1 000 000"
              postfix="грн"
            />
            {/* TODO: on mock server posibble have value with minus */}
            <Validations field="nhsContractPrice">
              <Validation.Required message="Об&#700;язкове поле" />
              {/* <Validation.Matches
                options={"^(\\d{1,7})(\\.\\d{1,2})?$"}
                message="Не вірно вказана сума"
              /> */}
            </Validations>
          </Box>
          <Box width={2 / 5}>
            <Field.Select
              type="select"
              name="nhsPaymentMethod"
              label="Спосіб оплати"
              placeholder="Оберіть cпосіб"
              items={nhsPaymentMethod}
              itemToString={({ value }) => value}
              renderItem={({ value }) => value}
              size="small"
              sendForm="key"
            />
            <Validation.Required
              field="nhsPaymentMethod"
              message="Обов&#700;язкове поле"
            />
          </Box>
        </Flex>
        <Box width={2 / 5}>
          <Field.Text
            name="issueCity"
            label="Місто укладення договору"
            placeholder="Введіть місто"
          />
          <Validation.Required
            field="issueCity"
            message="Обов&#700;язкове поле"
          />
        </Box>
        <Flex mt={5}>
          <Box mr={3}>
            <Link to="../">
              <ButtonWidth variant="blue">Повернутися</ButtonWidth>
            </Link>
          </Box>
          <LocationParams>
            {({ locationParams }) => (
              <Mutation mutation={UpdateContractRequestMutation}>
                {updateContractRequest => (
                  <ButtonWidth
                    variant="green"
                    onClick={async () => {
                      await updateContractRequest({
                        variables: {
                          input: {
                            ...locationParams,
                            miscellaneous
                          }
                        }
                      });
                      navigate("./check");
                    }}
                  >
                    Оновити
                  </ButtonWidth>
                )}
              </Mutation>
            )}
          </LocationParams>
        </Flex>
      </Form>
    </Box>
  );
};
const Checking = ({ id, navigate }) => (
  <Box m={5}>
    <Line />
    <Query
      query={ContractRequestQuery}
      variables={{
        id
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const {
          contractRequest: {
            nhsSigner: { id: nhsSignerId },
            nhsContractPrice,
            nhsPaymentMethod,
            ...contractRequest
          }
        } = data;

        return (
          <>
            <DefinitionListView
              labels={{
                nhsSignerId: "Підписант зі сторони Замовника",
                nhsSignerBase: "Що діє на підставі",
                nhsContractPrice: "Сума контракту",
                nhsPaymentMethod: "Спосіб оплати",
                issueCity: "Місто укладення договору"
              }}
              data={{
                nhsSignerId,
                nhsContractPrice: `${nhsContractPrice} грн`,
                nhsPaymentMethod: STATUSES.NHS_PAYMENT_METHOD[nhsPaymentMethod],
                ...contractRequest
              }}
              labelWidth="300px"
              marginBetween={2}
              flexDirection="column"
            />
            <Sign id={id} data={data.contractRequest} navigate={navigate} />
          </>
        );
      }}
    </Query>
  </Box>
);
const Sign = ({ id, data, navigate }) => (
  <Signer.Parent
    url={REACT_APP_SIGNER_URL}
    features={{
      width: 640,
      height: 589
    }}
  >
    {({ signData }) => (
      <Mutation mutation={ApproveContractRequestMutation}>
        {approveContractRequest => (
          <Flex mt={5}>
            <Box mr={3}>
              <Link to="../">
                <Button variant="blue">Повернутися</Button>
              </Link>
            </Box>
            <Tooltip
              component={() => (
                <Button
                  variant="green"
                  onClick={async () => {
                    const { signedContent } = await signData(data);

                    await approveContractRequest({
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
                  Увага !<br />
                  Затверджуючи запит, ПІДТВЕРДЖУЄТЕ дійсність власних намірів, а
                  також що зміст правочину ВІДПОВІДАЄ ВАШІЇЙ ВОЛІ, ПРИЙНЯТИЙ ТА
                  ПІДПИСАНИЙ ОСОБИСТО ВАМИ.
                </>
              }
            />
          </Flex>
        )}
      </Mutation>
    )}
  </Signer.Parent>
);

const OpacityBox = system({ is: Box, opacity: 0.5 });

const ButtonWidth = system({ is: Button, width: 140 });

export default Approve;
