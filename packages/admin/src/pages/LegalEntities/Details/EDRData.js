//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Box } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import Line from "../../../components/Line";
import EmptyData from "../../../components/EmptyData";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import type { LegalEntity } from "@ehealth-ua/schema";

const EDRData = ({ edrData }: { edrData: LegalEntity.edrData }) => {
  if (isEmpty(edrData)) return <EmptyData />;
  const {
    edrId,
    edrpou,
    insertedAt,
    isActive,
    kveds,
    legalForm,
    registrationAddress,
    state,
    updatedAt
  } = edrData;

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          edrpou: <Trans>EDRPOU</Trans>,
          registrationAddress: <Trans>Registration address</Trans>
        }}
        data={{
          edrpou,
          registrationAddress:
            registrationAddress && registrationAddress.address
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          legalForm: <Trans>Form of managment</Trans>,
          kveds: <Trans>KVED</Trans>
        }}
        data={{
          legalForm: <DictionaryValue name="LEGAL_FORM" item={legalForm} />,
          kveds: (
            <DictionaryValue
              name="KVEDS"
              render={dict => (
                <>
                  {kveds.map((kved, key, arr) => (
                    <React.Fragment key={key}>
                      {dict[kved.code] || kved.code}
                      {key !== arr.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </>
              )}
            />
          )
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          edrId: <Trans>EDR ID</Trans>,
          insertedAt: <Trans>Inserted at</Trans>,
          updatedAt: <Trans>Updated at</Trans>,
          state: <Trans>Legal entity state</Trans>,
          isActive: <Trans>Is EDR data actual</Trans>
        }}
        data={{
          edrId,
          insertedAt: <DateFormat value={insertedAt} />,
          updatedAt: <DateFormat value={updatedAt} />,
          state: <DictionaryValue name="EDR_STATE" item={state} />,
          isActive: isActive ? <PositiveIcon /> : <NegativeIcon />
        }}
      />
    </Box>
  );
};

EDRData.fragments = {
  entry: gql`
    fragment LegalEntityEDRData on LegalEntity {
      edrData {
        databaseId
        edrId
        edrpou
        insertedAt
        isActive
        kveds {
          code
          isPrimary
        }
        legalForm
        name
        publicName
        registrationAddress {
          address
        }
        shortName
        state
        updatedAt
      }
    }
  `
};

export default EDRData;
