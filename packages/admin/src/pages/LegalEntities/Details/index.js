//@flow
import React from "react";
import gql from "graphql-tag";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";

import { LocationParams } from "@ehealth/components";

import Tabs from "../../../components/Tabs";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Ability from "../../../components/Ability";
import Breadcrumbs from "../../../components/Breadcrumbs";

import { ITEMS_PER_PAGE } from "../../../constants/pagination";

import Owner from "./Owner";
import Header from "./Header";
import EDRData from "./EDRData";
import License from "./License";
import Divisions from "./Divisions";
import GeneralInfo from "./GeneralInfo";
import RelatedLegalEntities from "./RelatedLegalEntities";

import type { Scalars } from "@ehealth-ua/schema";

const filteredLocationParams = (id, params = {}) => {
  const { filter } = params;
  return {
    id,
    ...filter,
    firstMergedFromLegalEntities: ITEMS_PER_PAGE[0],
    firstDivisions: ITEMS_PER_PAGE[0]
  };
};

const Details = ({
  id,
  navigate
}: {
  id: Scalars.ID,
  navigate: string => mixed
}) => (
  <Query query={LegalEntityQuery} variables={filteredLocationParams(id)}>
    {({ loading, data: { legalEntity = {} } }) => {
      if (isEmpty(legalEntity)) return null;
      const {
        id,
        databaseId,
        status,
        edrpou,
        name,
        phones = [],
        email,
        type,
        ownerPropertyType,
        kveds,
        nhsVerified,
        edrVerified,
        edrData,
        nhsReviewed,
        nhsComment,
        owner,
        mergedToLegalEntity,
        website,
        receiverFundsCode,
        legalForm,
        beneficiary,
        archive,
        license,
        accreditation,
        residenceAddress
      } = legalEntity;
      const isVerificationActive = status === "ACTIVE" && nhsReviewed;

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/legal-entities">
                  <Trans>Search legal entities</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Legal entity details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Header
              id={id}
              databaseId={databaseId}
              status={status}
              edrData={edrData}
              nhsReviewed={nhsReviewed}
              name={name}
              navigate={navigate}
            />
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General info</Trans>
            </Tabs.NavItem>
            {edrData &&
              edrData.edrId && (
                <Tabs.NavItem to="./edr-data">
                  <Trans>EDR Data</Trans>
                </Tabs.NavItem>
              )}
            <Tabs.NavItem to="./licenses">
              <Trans>Licenses</Trans> / <Trans>Verification</Trans>
            </Tabs.NavItem>
            <Ability action="read" resource="related_legal_entities">
              <Tabs.NavItem to="./related-legal-entities">
                <Trans>Related legal entity</Trans>
              </Tabs.NavItem>
            </Ability>
            {owner && (
              <Tabs.NavItem to="./owner">
                <Trans>Owner</Trans>
              </Tabs.NavItem>
            )}
            <Ability action="read" resource="division">
              <Tabs.NavItem to="./divisions">
                <Trans>Divisions</Trans>
              </Tabs.NavItem>
            </Ability>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo
                path="/"
                edrpou={edrpou}
                name={name}
                phones={phones}
                email={email}
                type={type}
                ownerPropertyType={ownerPropertyType}
                kveds={kveds}
                website={website}
                receiverFundsCode={receiverFundsCode}
                legalForm={legalForm}
                beneficiary={beneficiary}
                archive={archive}
                residenceAddress={residenceAddress}
              />
              <EDRData path="/edr-data" edrData={edrData} />
              <License
                path="/licenses"
                license={license}
                accreditation={accreditation}
                nhsVerified={nhsVerified}
                edrVerified={edrVerified}
                nhsComment={nhsComment}
                isVerificationActive={isVerificationActive}
              />
              <RelatedLegalEntities
                path="/related-legal-entities"
                status={status}
                mergedToLegalEntity={mergedToLegalEntity}
              />
              <Owner path="/owner" owner={owner} />
              <Divisions path="/divisions" />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

export const LegalEntityQuery = gql`
  query LegalEntityQuery(
    $id: ID!
    $mergeLegalEntityFilter: RelatedLegalEntityFilter
    $divisionFilter: DivisionFilter
    $orderByMergedFromLegalEntities: RelatedLegalEntityOrderBy
    $firstMergedFromLegalEntities: Int
    $lastMergedFromLegalEntities: Int
    $beforeMergedFromLegalEntities: String
    $afterMergedFromLegalEntities: String
    $firstDivisions: Int
    $lastDivisions: Int
    $beforeDivisions: String
    $afterDivisions: String
  ) {
    legalEntity(id: $id) {
      ...LegalEntityHeader
      ...LegalEntityGeneralInfo
      ...LegalEntityEDRData
      ...LegalEntityLicense
      ...LegalEntityOwner
      ...LegalEntityDivisions
      ...RelatedLegalEntities
    }
  }
  ${Header.fragments.entry}
  ${GeneralInfo.fragments.entry}
  ${EDRData.fragments.entry}
  ${License.fragments.entry}
  ${Owner.fragments.entry}
  ${Divisions.fragments.entry}
  ${RelatedLegalEntities.fragments.entry}
`;

export default Details;
