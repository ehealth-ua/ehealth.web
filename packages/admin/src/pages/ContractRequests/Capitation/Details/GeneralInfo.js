//@flow

import React from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { DateFormat, Trans } from "@lingui/macro";
import Line from "../../../../components/Line";
import FullName from "../../../../components/FullName";
import DictionaryValue from "../../../../components/DictionaryValue";
import DefinitionListView from "../../../../components/DefinitionListView";

import type { ContractRequest } from "@ehealth-ua/schema";

const GeneralInfo = ({
  endDate,
  startDate,
  nhsSigner,
  issueCity,
  statusReason,
  nhsSignerBase,
  nhsContractPrice,
  nhsPaymentMethod,
  contractorRmspAmount
}: {
  endDate: ContractRequest.endDate,
  startDate: ContractRequest.startDate,
  nhsSigner: ContractRequest.nhsSigner,
  issueCity: ContractRequest.issueCity,
  statusReason: ContractRequest.statusReason,
  nhsSignerBase: ContractRequest.nhsSignerBase,
  nhsContractPrice: ContractRequest.nhsContractPrice,
  nhsPaymentMethod: ContractRequest.nhsPaymentMethod,
  contractorRmspAmount: ContractRequest.contractorRmspAmount
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerName: <Trans>Signer name</Trans>,
        nhsSignerBase: <Trans>Signer base</Trans>,
        nhsContractPrice: <Trans>Contract Price</Trans>,
        nhsPaymentMethod: <Trans>Payment method</Trans>,
        issueCity: <Trans>The city of the conclusion of the contract</Trans>
      }}
      data={{
        nhsSignerName: nhsSigner && <FullName party={nhsSigner.party} />,
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod: nhsPaymentMethod && (
          <DictionaryValue
            name="CONTRACT_PAYMENT_METHOD"
            item={nhsPaymentMethod}
          />
        ),
        issueCity
      }}
    />
    {nhsSigner && <Line />}
    <DefinitionListView
      labels={{
        startDate: <Trans>Initial date of the contract</Trans>,
        endDate: <Trans>Expiry date of the contract</Trans>
      }}
      data={{
        startDate: <DateFormat value={startDate} />,
        endDate: <DateFormat value={endDate} />
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        contractorRmspAmount: (
          <Trans>Number of persons served by legal entity</Trans>
        )
      }}
      data={{
        contractorRmspAmount: (
          <>
            {contractorRmspAmount}
            <Grey>(станом на 01.01.2018)</Grey>
          </>
        )
      }}
    />
    {statusReason && (
      <>
        <Line />
        <DefinitionListView
          labels={{ statusReason: <Trans>Status Comment</Trans> }}
          data={{ statusReason }}
        />
      </>
    )}
  </Box>
);

const Grey = system(
  {
    color: "blueberrySoda"
  },
  "color"
);

GeneralInfo.fragments = {
  entry: gql`
    fragment GeneralInfo on CapitationContractRequest {
      startDate
      endDate
      nhsPaymentMethod
      nhsSignerBase
      nhsSigner {
        id
        party {
          id
          ...FullName
        }
      }
      issueCity
      statusReason
      nhsContractPrice
      contractorRmspAmount
    }
    ${FullName.fragments.entry}
  `
};

export default GeneralInfo;
