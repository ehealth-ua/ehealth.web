import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";
import { Router } from "@reach/router";
import { loader } from "graphql.macro";
import { Flex, Box } from "@rebass/emotion";
import { PositiveIcon } from "@ehealth/icons";
import { Query, Mutation } from "react-apollo";
import { DateFormat, Trans } from "@lingui/macro";

import Tabs from "../../components/Tabs";
import Popup from "../../components/Popup";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Ability from "../../components/Ability";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

const INNMDosageQuery = loader("../../graphql/INNMDosageQuery.graphql");
const DeactivateINNMDosageMutation = loader(
  "../../graphql/DeactivateINNMDosageMutation.graphql"
);

const Details = ({ id }) => {
  const [isVisible, setVisibilityState] = useState(false);
  const toggle = () => setVisibilityState(!isVisible);

  return (
    <Query query={INNMDosageQuery} variables={{ id }}>
      {({ loading, error, data: { innmDosage = {} } }) => {
        if (isEmpty(innmDosage)) return null;
        const { databaseId, name, form, isActive, ingredients } = innmDosage;

        return (
          <LoadingOverlay loading={loading}>
            <Box p={6}>
              <Box py={10}>
                <Breadcrumbs.List>
                  <Breadcrumbs.Item to="/innm-dosages">
                    <Trans>INNM dosages</Trans>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Trans>INNM dosage details</Trans>
                  </Breadcrumbs.Item>
                </Breadcrumbs.List>
              </Box>
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <DefinitionListView
                    labels={{
                      databaseId: <Trans>INNM dosage ID</Trans>,
                      name: <Trans>Name</Trans>,
                      form: <Trans>Form</Trans>,
                      isActive: <Trans>Status</Trans>
                    }}
                    data={{
                      databaseId,
                      name,
                      form: (
                        <DictionaryValue name="MEDICATION_FORM" item={form} />
                      ),
                      isActive: (
                        <Badge
                          type="ACTIVE_STATUS_F"
                          name={isActive}
                          variant={!isActive}
                          minWidth={100}
                        />
                      )
                    }}
                    color="#7F8FA4"
                    labelWidth="120px"
                  />
                </Box>
                {isActive && (
                  <Ability action="write" resource="innm_dosage">
                    <Box>
                      <Mutation
                        mutation={DeactivateINNMDosageMutation}
                        refetchQueries={() => [
                          {
                            query: INNMDosageQuery,
                            variables: {
                              id
                            }
                          }
                        ]}
                      >
                        {deactivateINNMDosage => (
                          <>
                            <Button onClick={toggle} variant="red">
                              <Trans>Deactivate</Trans>
                            </Button>
                            <Popup
                              visible={isVisible}
                              onCancel={toggle}
                              title={
                                <>
                                  <Trans>Deactivate</Trans> "{name}
                                  "?
                                </>
                              }
                              okText={<Trans>Deactivate</Trans>}
                              onOk={async () => {
                                await deactivateINNMDosage({
                                  variables: {
                                    input: {
                                      id
                                    }
                                  }
                                });
                                toggle();
                              }}
                            />
                          </>
                        )}
                      </Mutation>
                    </Box>
                  </Ability>
                )}
              </Flex>
            </Box>
            <Tabs.Nav>
              <Tabs.NavItem to="./">
                <Trans>Ingredients</Trans>
              </Tabs.NavItem>
            </Tabs.Nav>
            <Tabs.Content>
              <Router>
                <Ingredients path="/" data={ingredients} />
              </Router>
            </Tabs.Content>
          </LoadingOverlay>
        );
      }}
    </Query>
  );
};

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
        nameOriginal: <Trans>INNM original name</Trans>,
        sctid: <Trans>SCTID</Trans>,
        insertedAt: <Trans>Inserted at</Trans>,
        isPrimary: <Trans>Primary</Trans>
      }}
      renderRow={({ isPrimary, dosage, innm }) => {
        const { insertedAt, ...innmDetails } = innm || {};
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
      hiddenFields="nameOriginal,sctid,insertedAt"
      tableName="INNMDosagesIngredients/search"
    />
  );
};

export default Details;
