//@flow
import React from "react";
import gql from "graphql-tag";
import isEmpty from "lodash/isEmpty";
import { Box, Heading } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { DateFormat, Trans } from "@lingui/macro";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";

import Line from "../../../components/Line";
import Table from "../../../components/Table";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import type { Scalars, LegalEntity } from "@ehealth-ua/schema";

import NHSVerify from "./Mutations/NHSVerify";
import NHSComment from "./Mutations/NHSComment";

const License = ({
  id,
  isVerificationActive,
  license,
  accreditation,
  nhsVerified,
  edrVerified,
  nhsComment
}: {
  id: Scalars.ID,
  isVerificationActive: LegalEntity.isVerificationActive,
  license: LegalEntity.license,
  accreditation: LegalEntity.accreditation,
  nhsVerified: LegalEntity.nhsVerified,
  edrVerified: LegalEntity.edrVerified,
  nhsComment: LegalEntity.nhsComment
}) => (
  <Box p={5}>
    {!isEmpty(accreditation) && (
      <>
        <Heading fontSize="1" fontWeight="normal" mb={5}>
          <Trans>Accreditation</Trans>
        </Heading>
        <DefinitionListView
          labels={{
            category: <Trans>Category</Trans>,
            validateDate: <Trans>Validate Date</Trans>,
            orderDate: <Trans>Order Date</Trans>,
            orderNo: <Trans>Order Number</Trans>
          }}
          data={{
            ...accreditation,
            category: accreditation.category && (
              <DictionaryValue
                name="ACCREDITATION_CATEGORY"
                item={accreditation.category}
              />
            ),
            validateDate: (
              <>
                <Trans>From</Trans>{" "}
                <DateFormat value={accreditation.issuedDate} />{" "}
                {accreditation.expiryDate ? (
                  <>
                    <Trans>To</Trans>{" "}
                    <DateFormat value={accreditation.expiryDate} />
                  </>
                ) : (
                  ""
                )}
              </>
            ),
            orderDate: <DateFormat value={accreditation.orderDate} />
          }}
        />
        <Line />
      </>
    )}
    {!isEmpty(license) && (
      <>
        <Heading fontSize="1" fontWeight="normal" mb={5}>
          <Trans>Licenses</Trans>
        </Heading>

        <Table
          data={[license]}
          header={{
            licenseNumber: <Trans>License number</Trans>,
            whatLicensed: <Trans>Issued to</Trans>,
            issuedDate: <Trans>Date of issue</Trans>,
            issuedBy: <Trans>Authority that issued</Trans>,
            validateDate: <Trans>Validate Date</Trans>,
            orderNo: <Trans>Order Number</Trans>
          }}
          renderRow={({
            activeFromDate,
            expiryDate,
            issuedDate,
            ...license
          }) => ({
            validateDate: (
              <>
                <Trans>From</Trans> <DateFormat value={activeFromDate} />{" "}
                {expiryDate ? (
                  <>
                    <Trans>To</Trans> <DateFormat value={expiryDate} />
                  </>
                ) : (
                  ""
                )}
              </>
            ),
            issuedDate: <DateFormat value={issuedDate} />,
            ...license
          })}
          tableName="legal-entities/licenses"
        />
        <Line />
      </>
    )}

    <OpacityBox mt={5} opacity={isVerificationActive ? 1 : 0.5}>
      <Heading fontSize="1" fontWeight="normal" mb={5}>
        <Trans>Verification</Trans>
      </Heading>
      <DefinitionListView
        labels={{
          nhsVerified: <Trans>Verification NZZU</Trans>,
          edrVerified: <Trans>EDR Verification</Trans>
        }}
        data={{
          nhsVerified: nhsVerified ? <PositiveIcon /> : <NegativeIcon />,
          edrVerified: edrVerified ? <PositiveIcon /> : <NegativeIcon />
        }}
      />
      <Box mt={3} mb={4}>
        <NHSVerify
          id={id}
          isVerificationActive={isVerificationActive}
          nhsVerified={nhsVerified}
        />
      </Box>
      <NHSComment id={id} nhsComment={nhsComment} />
    </OpacityBox>
  </Box>
);

const OpacityBox = system(
  {
    extend: Box,
    opacity: 1
  },
  "opacity"
);

License.fragments = {
  entry: gql`
    fragment LegalEntityLicense on LegalEntity {
      nhsComment
      edrVerified
      license {
        licenseNumber
        issuedBy
        issuedDate
        expiryDate
        activeFromDate
        whatLicensed
        orderNo
      }
      accreditation {
        category
        issuedDate
        expiryDate
        orderNo
        orderDate
      }
    }
  `
};

export default License;
