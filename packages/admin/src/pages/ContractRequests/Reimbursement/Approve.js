import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { getFullName } from "@ehealth/utils";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../../components/Line";
import Badge from "../../../components/Badge";
import Steps from "../../../components/Steps";
import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import env from "../../../env";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);
const ApproveContractRequestMutation = loader(
  "../../../graphql/ApproveContractRequestMutation.graphql"
);

const Approve = ({ id }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="../update">
          <Trans>Дозаповніть поля</Trans>
        </Steps.Item>
        <Steps.Item to="./">
          <Trans>Підтвердіть з ЕЦП</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>

    <Query
      query={ReimbursementContractRequestQuery}
      variables={{
        id
      }}
    >
      {({ loading, error, data: { reimbursementContractRequest } = {} }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const {
          status,
          databaseId,
          contractorLegalEntity: { databaseId: legalEntityId, name, edrpou }
        } = reimbursementContractRequest;

        return (
          <>
            <OpacityBox m={5}>
              <DefinitionListView
                labels={{
                  id: <Trans>ID заяви</Trans>,
                  status: <Trans>Статус</Trans>,
                  edrpou: <Trans>ЄДРПОУ</Trans>,
                  name: <Trans>Назва</Trans>,
                  legalEntityId: <Trans>ID аптеки</Trans>
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
              <ApproveContractRequest
                path="/"
                data={reimbursementContractRequest}
              />
            </Router>
          </>
        );
      }}
    </Query>
  </>
);

const ApproveContractRequest = ({ id, navigate, data }) => {
  const { nhsSigner, nhsPaymentMethod, ...reimbursementContractRequest } = data;
  return (
    <Box m={5}>
      <Line />
      <DefinitionListView
        labels={{
          nhsSigner: <Trans>Підписант зі сторони Замовника</Trans>,
          nhsSignerBase: <Trans>Що діє на підставі</Trans>,
          nhsPaymentMethod: <Trans>Спосіб оплати</Trans>,
          issueCity: <Trans>Місто укладення договору</Trans>,
          miscellaneous: <Trans>Інші умови</Trans>
        }}
        data={{
          nhsSigner: nhsSigner && getFullName(nhsSigner.party),
          nhsPaymentMethod: nhsPaymentMethod && (
            <DictionaryValue
              name="CONTRACT_PAYMENT_METHOD"
              item={nhsPaymentMethod}
            />
          ),
          ...reimbursementContractRequest
        }}
        labelWidth="300px"
        marginBetween={2}
        flexDirection="column"
      />

      <Sign id={id} data={data} navigate={navigate} />
    </Box>
  );
};

const Sign = ({ id, data: { toApproveContent }, navigate }) => (
  <Signer.Parent
    url={env.REACT_APP_SIGNER_URL}
    features={{
      width: 640,
      height: 589
    }}
  >
    {({ signData }) => (
      <Mutation
        mutation={ApproveContractRequestMutation}
        refetchQueries={() => [
          {
            query: ReimbursementContractRequestQuery,
            variables: { id }
          }
        ]}
      >
        {approveContractRequest => (
          <Flex mt={5}>
            <Box mr={3}>
              <Link to="../update">
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
                    const { signedContent } = await signData(toApproveContent);

                    await approveContractRequest({
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
                    navigate("../");
                  }}
                >
                  <Trans>Затвердити, наклавши ЕЦП</Trans>
                </Button>
              )}
              content={toApproveContent && toApproveContent.text}
            />
          </Flex>
        )}
      </Mutation>
    )}
  </Signer.Parent>
);

const OpacityBox = system({ is: Box, opacity: 0.5 });

export default Approve;
