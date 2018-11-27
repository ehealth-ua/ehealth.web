import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box, Text } from "rebass/emotion";
import { loader } from "graphql.macro";

import { getFullName } from "@ehealth/utils";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { AdminSearchIcon, PositiveIcon, NegativeIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../components/Line";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import * as Field from "../../components/Field";
import DefinitionListView from "../../components/DefinitionListView";

import env from "../../env";
import STATUSES from "../../helpers/statuses";

const LegalEntityQuery = loader("../../graphql/LegalEntityQuery.graphql");
const SearchLegalEntitiesQuery = loader(
  "../../graphql/SearchLegalEntitiesQuery.graphql"
);
const MergeLegalEntitiesMutation = loader(
  "../../graphql/MergeLegalEntitiesMutation.graphql"
);

const Add = ({ location: { state } }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          Знайдіть медзаклад
        </Steps.Item>
        <Steps.Item
          to="./reason"
          state={state}
          disabled={state && !state.reason}
        >
          Вкажіть підставу
        </Steps.Item>
        <Steps.Item to="./sign" state={state} disabled={state && !state.reason}>
          Підтвердіть з ЕЦП
        </Steps.Item>
      </Steps.List>
    </Box>
    <Router>
      <Search path="/" />
      <Reason path="/reason" />
      <Sign path="/sign" />
    </Router>
  </>
);

const Search = ({ location: { state } }) => (
  <LocationParams>
    {({ locationParams: { filter, orderBy }, setLocationParams }) => (
      <>
        <Form onSubmit={setLocationParams} initialValues={{ filter, orderBy }}>
          <Box px={5} width={460}>
            <Field.Text
              name="filter.edrpou"
              label="Знайти підпорядкований медзаклад"
              placeholder="Введіть ЄДРПОУ медзакладу"
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          </Box>
        </Form>
        {filter && (
          <Query
            query={SearchLegalEntitiesQuery}
            variables={{ filter, first: 1 }}
          >
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error! ${error.message}`;
              const { nodes: legalEntities } = data.legalEntities;
              const [legalEntity] = legalEntities;
              return legalEntities.length ? (
                <>
                  <Table
                    data={legalEntities}
                    header={{
                      databaseId: "ID Медзакладу",
                      name: "Назва Медзакладу",
                      edrpou: "ЄДРПОУ",
                      owner: "Керівник",
                      type: "Тип",
                      nhsVerified: "Верифікований НСЗУ",
                      status: "Статус"
                    }}
                    renderRow={({
                      status,
                      nhsVerified,
                      owner,
                      type,
                      ...legalEntity
                    }) => ({
                      ...legalEntity,
                      type: STATUSES.LEGAL_ENTITY_TYPE[type],
                      owner: owner && getFullName(owner.party),
                      nhsVerified: (
                        <Flex justifyContent="center">
                          {nhsVerified ? <PositiveIcon /> : <NegativeIcon />}
                        </Flex>
                      ),
                      status: (
                        <Badge
                          name={status}
                          type="LEGALENTITY"
                          display="block"
                        />
                      )
                    })}
                    tableName="legalEntity/Add"
                  />
                  <Flex px={5} mt={5}>
                    <Box mr={3}>
                      <Link to="../related-legal-entities">
                        <Button variant="blue">Повернутися</Button>
                      </Link>
                    </Box>
                    <Link to="./reason" state={{ legalEntity, ...state }}>
                      <Button variant="green">Далі</Button>
                    </Link>
                  </Flex>
                </>
              ) : null;
            }}
          </Query>
        )}
      </>
    )}
  </LocationParams>
);

const Reason = ({
  navigate,
  location: {
    state: {
      reason,
      legalEntity: { owner, databaseId, name, edrpou }
    }
  }
}) => (
  <Box pt={1} px={5}>
    {console.log(databaseId)}
    <Text fontSize={1} fontWeight="bold" mb={3}>
      Підпорядкований медзаклад
    </Text>
    <DefinitionListView
      labels={{
        edrpou: "ЄДРПОУ",
        name: "Назва",
        owner: "Власник"
      }}
      data={{
        edrpou,
        name
        // owner: getFullName(owner.party)
      }}
    />
    <DefinitionListView
      labels={{
        databaseId: "ID медзакладу"
      }}
      data={{
        databaseId
      }}
      color="#7F8FA4"
    />
    <Box width={460} pt={2}>
      <Form
        onSubmit={async ({ reason }) => {
          navigate("../sign", {
            state: { reason, legalEntity: { owner, databaseId, name, edrpou } }
          });
        }}
        initialValues={{ reason }}
      >
        <Field.Textarea
          name="reason"
          rows={6}
          label="Вкажіть підставу підпорядкування"
          placeholder="Приклад: Наказ КМУ № 73465"
        />
        <Validation.Required field="reason" message="Обов&#700;язкове поле" />
        <Flex>
          <Box mr={3}>
            <Link
              to="../"
              state={{
                reason,
                legalEntity: { owner, databaseId, name, edrpou }
              }}
            >
              <Button variant="blue">Повернутися</Button>
            </Link>
          </Box>
          <Button variant="green">Далі</Button>
        </Flex>
      </Form>
    </Box>
  </Box>
);

const Sign = ({
  id: legalEntityToId,
  location: {
    state: {
      reason,
      legalEntity: {
        databaseId: legalEntityFromId,
        name: legalEntityFromName,
        edrpou: legalEntityFromEdrpou,
        owner
      }
    }
  },
  navigate
}) => (
  <Query
    query={LegalEntityQuery}
    variables={{ id: legalEntityToId, first: 10 }}
  >
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        legalEntity: { databaseId, name, edrpou }
      } = data;
      const legalEntityTo = { id: databaseId, name, edrpou };
      const legalEntityFrom = {
        id: legalEntityFromId,
        name: legalEntityFromName,
        edrpou: legalEntityFromEdrpou
      };
      return (
        <Box px={5}>
          <Signer.Parent
            url={env.REACT_APP_SIGNER_URL}
            features={{ width: 640, height: 589 }}
          >
            {({ signData }) => (
              <Mutation mutation={MergeLegalEntitiesMutation}>
                {mergeLegalEntities => (
                  <>
                    <Text fontSize={1} fontWeight="bold" mb={3}>
                      Основний медзаклад
                    </Text>
                    <DefinitionListView
                      labels={{
                        edrpou: "ЄДРПОУ",
                        name: "Назва",
                        id: "ID медзакладу"
                      }}
                      data={legalEntityTo}
                    />
                    <Line />
                    <Text fontSize={1} fontWeight="bold" mb={3}>
                      Підпорядкований медзаклад
                    </Text>
                    <DefinitionListView
                      labels={{
                        edrpou: "ЄДРПОУ",
                        name: "Назва",
                        id: "ID медзакладу"
                      }}
                      data={legalEntityFrom}
                    />
                    <Line />
                    <DefinitionListView
                      labels={{
                        reason: "Підстава підпорядкування"
                      }}
                      data={{ reason }}
                    />
                    <Flex>
                      <Box mr={3}>
                        <Link
                          to="../reason"
                          state={{
                            reason,
                            legalEntity: {
                              id: legalEntityFromId,
                              name: legalEntityFromName,
                              edrpou: legalEntityFromEdrpou,
                              owner
                            }
                          }}
                        >
                          <Button variant="blue">Повернутися</Button>
                        </Link>
                      </Box>
                      <Tooltip
                        component={() => (
                          <Button
                            variant="green"
                            onClick={async () => {
                              const mergedLegalEntities = {
                                merged_from_legal_entity: legalEntityFrom,
                                merged_to_legal_entity: legalEntityTo,
                                reason
                              };
                              const { signedContent } = await signData(
                                mergedLegalEntities
                              );
                              await mergeLegalEntities({
                                variables: {
                                  input: {
                                    signedContent: {
                                      content: signedContent,
                                      encoding: "BASE64"
                                    }
                                  }
                                }
                              });
                              navigate("/legal-entity-merge-jobs");
                            }}
                          >
                            Підписати
                          </Button>
                        )}
                        content={
                          <>
                            Увага! <br />
                            Затверджуючи запит, ПІДТВЕРДЖУЄТЕ дійсність власних
                            намірів , а також що зміст правочину ВІДПОВІДАЄ
                            ВАШІЇЙ ВОЛІ, ПРИЙНЯТИЙ ТА ПІДПИСАНИЙ ОСОБИСТО ВАМИ.
                          </>
                        }
                      />
                    </Flex>
                  </>
                )}
              </Mutation>
            )}
          </Signer.Parent>
        </Box>
      );
    }}
  </Query>
);

export default Add;
