import React from "react";
import isEmpty from "lodash/isEmpty";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Box, Flex } from "@rebass/emotion";
import { PositiveIcon } from "@ehealth/icons";
import { Mutation, Query } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";

import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

const MedicationQuery = loader("../../graphql/MedicationQuery.graphql");

const Details = ({ id }) => (
  <Query query={MedicationQuery} variables={{ id }}>
    {({ loading, error, data: { medication = {} } }) => {
      if (isEmpty(medication)) return null;
      const {
        databaseId,
        isActive,
        name,
        atcCodes,
        packageMinQty,
        packageQty,
        form,
        manufacturer,
        certificate,
        certificateExpiredAt,
        ingredients
      } = medication;
      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/medications">
                  <Trans>Medications</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Medication details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>ID</Trans>,
                    name: <Trans>Name</Trans>,
                    status: <Trans>Status</Trans>
                  }}
                  data={{
                    databaseId,
                    name,
                    status: (
                      <Badge
                        name={isActive}
                        type="ACTIVE_STATUS_F"
                        variant={!isActive}
                        minWidth={100}
                      />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General info</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./ingredients">
              <Trans>Ingredients</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo
                path="/"
                atcCodes={atcCodes}
                packageMinQty={packageMinQty}
                packageQty={packageQty}
                form={form}
                manufacturer={manufacturer}
                certificate={certificate}
                certificateExpiredAt={certificateExpiredAt}
              />
              <Ingredients path="/ingredients" data={ingredients} />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  atcCodes = [],
  packageMinQty,
  packageQty,
  form,
  manufacturer: { name: manufacturerName, country: manufacturerCountry } = {},
  certificate,
  certificateExpiredAt
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        atcCodes: <Trans>Atc Codes</Trans>,
        packageMinQty: <Trans>packageMinQty</Trans>,
        packageQty: <Trans>packageQty</Trans>,
        form: <Trans>Medication form</Trans>
      }}
      data={{
        atcCodes: atcCodes.join(" "),
        packageMinQty,
        packageQty,
        form: <DictionaryValue name="MEDICATION_FORM" item={form} />
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        manufacturerName: <Trans>Manufacturer name</Trans>,
        manufacturerCountry: <Trans>Manufacturer country</Trans>
      }}
      data={{
        manufacturerName,
        manufacturerCountry
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        certificate: (
          <Trans>
            Certificate <br />
            number
          </Trans>
        ),
        certificateExpiredAt: <Trans>Certificate expired At</Trans>
      }}
      data={{
        certificate,
        certificateExpiredAt: <DateFormat value={certificateExpiredAt} />
      }}
    />
  </Box>
);

const Ingredients = ({ data = [] }) => {
  if (isEmpty(data)) return null;
  const ingredients = data.sort(ingredient => (ingredient.isPrimary ? -1 : 1));

  return (
    <Table
      data={ingredients}
      header={{
        databaseId: <Trans>ID</Trans>,
        name: <Trans>INNM</Trans>,
        dosage: <Trans>Mixture</Trans>,
        insertedAt: <Trans>Inserted at</Trans>,
        isPrimary: <Trans>Primary</Trans>
      }}
      renderRow={({ isPrimary, dosage, innmDosage }) => {
        const { insertedAt, ...innmDetails } = innmDosage || {};
        const {
          numeratorUnit,
          numeratorValue,
          denumeratorUnit,
          denumeratorValue
        } = dosage || {};

        return {
          ...innmDetails,
          insertedAt: (
            <DateFormat
              value={insertedAt}
              format={{
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              }}
            />
          ),
          isPrimary: isPrimary && (
            <Flex justifyContent="center">
              <PositiveIcon />
            </Flex>
          ),
          dosage: (
            <>
              {denumeratorValue}{" "}
              <DictionaryValue name="MEDICATION_UNIT" item={denumeratorUnit} />{" "}
              <Trans>includes</Trans> {numeratorValue}{" "}
              <DictionaryValue name="MEDICATION_UNIT" item={numeratorUnit} />
            </>
          )
        };
      }}
      whiteSpaceNoWrap={["databaseId"]}
      hiddenFields="insertedAt"
      tableName="MedicationIngredients/search"
    />
  );
};

export default Details;
