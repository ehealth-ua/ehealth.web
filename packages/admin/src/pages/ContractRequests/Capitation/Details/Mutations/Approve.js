import React from "react";
import { Query } from "react-apollo";
import { Router } from "@reach/router";
import { Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { Trans } from "@lingui/macro";
import { getFullName } from "@ehealth/utils";
import isEmpty from "lodash/isEmpty";

import Line from "../../../../../components/Line";
import Badge from "../../../../../components/Badge";
import Steps from "../../../../../components/Steps";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import DictionaryValue from "../../../../../components/DictionaryValue";
import DefinitionListView from "../../../../../components/DefinitionListView";
import SignContractRequest from "../../../../../components/SignContractRequest";

import { CapitationContractRequestQuery } from "../";

const Approve = ({ id }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="../update">
          <Trans>Fill in fields</Trans>
        </Steps.Item>
        <Steps.Item to="./">
          <Trans>Confirm with EDS</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>

    <Query
      query={CapitationContractRequestQuery}
      variables={{
        id
      }}
    >
      {({ loading, error, data: { capitationContractRequest } = {} }) => {
        if (isEmpty(capitationContractRequest)) return null;
        const {
          status,
          databaseId,
          contractorLegalEntity: {
            databaseId: legalEntityId,
            name,
            edrpou
          } = {}
        } = capitationContractRequest;

        return (
          <LoadingOverlay loading={loading}>
            <OpacityBox m={5}>
              <DefinitionListView
                labels={{
                  id: <Trans>Contract request ID</Trans>,
                  status: <Trans>Status</Trans>,
                  edrpou: <Trans>EDRPOU</Trans>,
                  name: <Trans>Name</Trans>,
                  legalEntityId: <Trans>Legal entity ID</Trans>
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
                data={capitationContractRequest}
              />
            </Router>
          </LoadingOverlay>
        );
      }}
    </Query>
  </>
);

const ApproveContractRequest = ({ id, navigate, data }) => {
  const {
    nhsSigner,
    nhsContractPrice,
    nhsPaymentMethod,
    ...capitationContractRequest
  } = data;
  return (
    <Box m={5}>
      <Line />
      <DefinitionListView
        labels={{
          nhsSigner: <Trans>Signatory from the Customers side</Trans>,
          nhsSignerBase: <Trans>Basis</Trans>,
          nhsContractPrice: <Trans>Contract Amount</Trans>,
          nhsPaymentMethod: <Trans>Payment method</Trans>,
          issueCity: <Trans>The city of the conclusion of the contract</Trans>,
          miscellaneous: <Trans>Miscellaneous</Trans>
        }}
        data={{
          nhsSigner: nhsSigner && getFullName(nhsSigner.party),
          nhsContractPrice: (
            <>
              {nhsContractPrice} <Trans>uah</Trans>
            </>
          ),
          nhsPaymentMethod: (
            <DictionaryValue
              name="CONTRACT_PAYMENT_METHOD"
              item={nhsPaymentMethod}
            />
          ),
          ...capitationContractRequest
        }}
        labelWidth="300px"
        marginBetween={2}
        flexDirection="column"
      />

      <SignContractRequest
        id={id}
        data={data}
        navigate={navigate}
        query={CapitationContractRequestQuery}
      />
    </Box>
  );
};

const OpacityBox = system({ extend: Box, opacity: 0.5 }, "opacity", "space");

export default Approve;
