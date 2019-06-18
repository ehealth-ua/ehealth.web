//@flow

import React from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import Line from "../../../../components/Line";
import LinkComponent from "../../../../components/Link";
import AddressView from "../../../../components/AddressView";
import DefinitionListView from "../../../../components/DefinitionListView";
import type { ContractRequest } from "@ehealth-ua/schema";
import FullName from "../../../../components/FullName";

const LegalEntity = ({
  contractorBase,
  contractorOwner,
  contractorPaymentDetails: { bankName, mfo, payerAccount },
  contractorLegalEntity: {
    databaseId: legalEntityDatabaseId,
    id: legalEntityId,
    name,
    edrpou,
    addresses
  }
}: {
  contractorBase: ContractRequest.contractorBase,
  contractorOwner: ContractRequest.contractorOwner,
  contractorPaymentDetails: ContractRequest.contractorPaymentDetails,
  contractorLegalEntity: ContractRequest.contractorLegalEntity
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        edrpou: <Trans>EDRPOU</Trans>,
        name: <Trans>Name</Trans>,
        addresses: <Trans>Address</Trans>
      }}
      data={{
        name: name,
        edrpou: edrpou,
        addresses: addresses
          .filter(a => a.type === "REGISTRATION")
          .map((item, key) => <AddressView data={item} key={key} />)
      }}
    />
    <DefinitionListView
      color="blueberrySoda"
      labels={{
        legalEntityId: <Trans>Legal entity ID</Trans>
      }}
      data={{
        legalEntityId: (
          <LinkComponent to={`/legal-entities/${legalEntityId}`}>
            {legalEntityDatabaseId}
          </LinkComponent>
        )
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        fullName: <Trans>Subscriber Name</Trans>,
        contractorBase: <Trans>Based on</Trans>
      }}
      data={{
        fullName: contractorOwner && <FullName party={contractorOwner.party} />,
        contractorBase: contractorBase
      }}
    />
    <DefinitionListView
      color="blueberrySoda"
      labels={{
        ownerId: <Trans>Signer ID</Trans>
      }}
      data={{
        ownerId: contractorOwner && contractorOwner.databaseId
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        bankName: <Trans>Bank</Trans>,
        mfo: <Trans>Bank Code (MFO)</Trans>,
        payerAccount: <Trans>Account number</Trans>
      }}
      data={{
        bankName,
        mfo,
        payerAccount
      }}
    />
  </Box>
);

LegalEntity.fragments = {
  entry: gql`
    fragment LegalEntity on CapitationContractRequest {
      contractorBase
      contractorOwner {
        id
        databaseId
        party {
          id
          ...FullName
        }
      }
      contractorPaymentDetails {
        bankName
        mfo
        payerAccount
      }
      contractorLegalEntity {
        id
        name
        edrpou
        databaseId
        status
        addresses {
          ...Addresses
        }
      }
    }
    ${AddressView.fragments.entry}
    ${FullName.fragments.entry}
  `
};

export default LegalEntity;
