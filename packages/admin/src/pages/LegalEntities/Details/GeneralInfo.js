//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { getPhones } from "@ehealth/utils";
import { Box, Heading } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { DateFormat, Trans } from "@lingui/macro";

import Line from "../../../components/Line";
import AddressView from "../../../components/AddressView";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import type { LegalEntity } from "@ehealth-ua/schema";

const GeneralInfo = ({
  phones,
  type,
  ownerPropertyType,
  kveds,
  receiverFundsCode,
  legalForm,
  beneficiary,
  archive,
  edrpou,
  email,
  website,
  residenceAddress
}: {
  phones: LegalEntity.phones,
  type: LegalEntity.type,
  ownerPropertyType: LegalEntity.ownerPropertyType,
  kveds: LegalEntity.kveds,
  receiverFundsCode: LegalEntity.receiverFundsCode,
  legalForm: LegalEntity.legalForm,
  beneficiary: LegalEntity.beneficiary,
  archive: LegalEntity.archive,
  edrpou: LegalEntity.edrpou,
  email: LegalEntity.email,
  website: LegalEntity.website,
  residenceAddress: LegalEntity.residenceAddress
}) => {
  const isDeprecatedDataPresent = kveds || ownerPropertyType || legalForm;
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          edrpou: <Trans>EDRPOU</Trans>,
          phones: <Trans>Phone</Trans>,
          email: <Trans>Email</Trans>,
          website: <Trans>Website</Trans>,
          type: <Trans>Type</Trans>,
          residenceAddress: <Trans>Legal Entity residence address</Trans>
        }}
        data={{
          edrpou,
          email,
          website,
          phones: getPhones(phones),
          type: type && (
            <DictionaryValue name="LEGAL_ENTITY_TYPE" item={type} />
          ),
          residenceAddress: residenceAddress && (
            <AddressView data={residenceAddress} />
          )
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          receiverFundsCode: <Trans>Beneficiary recipient Code</Trans>,
          beneficiary: <Trans>Beneficiary</Trans>
        }}
        data={{
          beneficiary,
          receiverFundsCode
        }}
      />
      {!isEmpty(archive) && (
        <>
          <Line />
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            <Trans>Archive</Trans>
          </Heading>

          {archive.map(({ date, place }, index) => (
            <ArchiveBox key={index}>
              <DefinitionListView
                labels={{
                  date: <Trans>Archiving Date</Trans>,
                  place: <Trans>Storage location</Trans>
                }}
                data={{
                  date: <DateFormat value={date} />,
                  place
                }}
              />
            </ArchiveBox>
          ))}
        </>
      )}
      {isDeprecatedDataPresent && (
        <>
          <Line />
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            <Trans>Non EDR data</Trans>
          </Heading>
          <DefinitionListView
            labels={{
              kveds: <Trans>KVED</Trans>
            }}
            data={{
              kveds: kveds && (
                <DictionaryValue
                  name="KVEDS"
                  render={dict => (
                    <>
                      {kveds.map((el, key, arr) => (
                        <React.Fragment key={key}>
                          {dict[el]}
                          {key !== arr.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                />
              )
            }}
          />
          <DefinitionListView
            labels={{
              ownerPropertyType: <Trans>Property type</Trans>,
              legalForm: <Trans>Form of managment</Trans>
            }}
            data={{
              ownerPropertyType: ownerPropertyType && (
                <DictionaryValue
                  name="OWNER_PROPERTY_TYPE"
                  item={ownerPropertyType}
                />
              ),
              legalForm: legalForm && (
                <DictionaryValue name="LEGAL_FORM" item={legalForm} />
              )
            }}
          />
        </>
      )}
    </Box>
  );
};

GeneralInfo.fragments = {
  entry: gql`
    fragment LegalEntityGeneralInfo on LegalEntity {
      phones {
        type
        number
      }
      type
      ownerPropertyType
      kveds
      receiverFundsCode
      legalForm
      beneficiary
      archive {
        date
        place
      }
      edrpou
      email
      website
      residenceAddress {
        apartment
        area
        building
        country
        region
        settlement
        settlementId
        settlementType
        street
        streetType
        type
        zip
      }
    }
  `
};

export default GeneralInfo;

const ArchiveBox = system(
  {
    extend: Box,
    mb: 6
  },
  `
    &:last-child {
      margin-bottom: 0;
    }
  `
);
