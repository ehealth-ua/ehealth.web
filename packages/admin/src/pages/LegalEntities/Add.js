import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";
import { getFullName } from "@ehealth/utils";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { AdminSearchIcon, PositiveIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import * as Field from "../../components/Field";
import DefinitionListView from "../../components/DefinitionListView";

import LegalEntityQuery from "../../graphql/LegalEntityQuery.graphql";
import LegalEntityByEdrpouQuery from "../../graphql/LegalEntityByEdrpouQuery.graphql";
import MergeLegalEntitiesMutation from "../../graphql/MergeLegalEntitiesMutation.graphql";

import { REACT_APP_SIGNER_URL } from "../../env";

const Add = () => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./">Знайдіть медзаклад</Steps.Item>
        <Steps.Item to="./reason">Вкажіть підставу</Steps.Item>
        <Steps.Item to="./sign">Підтвердіть з ЕЦП</Steps.Item>
      </Steps.List>
    </Box>
    <LocationParams>
      {({ locationParams: { edrpou, orderBy }, setLocationParams }) => (
        <Query
          query={LegalEntityByEdrpouQuery}
          variables={{ edrpou: edrpou || "" }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const { legalEntityByEdrpou } = data;
            return (
              <Router>
                <Search
                  path="/"
                  initialValues={{ edrpou, orderBy }}
                  onSubmit={setLocationParams}
                  data={legalEntityByEdrpou}
                />
                <Reason
                  path="/reason"
                  onSubmit={setLocationParams}
                  legalEntity={legalEntityByEdrpou}
                />
                <Sign path="/sign" />
              </Router>
            );
          }}
        </Query>
      )}
    </LocationParams>
  </>
);

const Search = ({ onSubmit, initialValues, data }) => (
  <>
    <Form onSubmit={onSubmit} initialValues={initialValues}>
      <Box px={5} width={460}>
        <Field.Text
          name="edrpou"
          label="Знайти підпорядкований медзаклад"
          placeholder="Введіть ЄДРПОУ медзакладу"
          postfix={<AdminSearchIcon color="#CED0DA" />}
        />
      </Box>
    </Form>
    {Object.entries(data).length && (
      <Table
        data={[data]}
        header={{
          id: "ID Медзакладу",
          name: "Назва Медзакладу",
          edrpou: "ЄДРПОУ",
          nhsVerified: "Верифікований НСЗУ",
          status: "Статус"
        }}
        renderRow={({ status, nhsVerified, ...legalEntity }) => ({
          ...legalEntity,
          nhsVerified: nhsVerified && <PositiveIcon />,
          status: <Badge name={status} type="LEGALENTITY" display="block" />
        })}
      />
    )}
    <Flex px={5} mt={5}>
      <Box mr={3}>
        <Button variant="blue" onClick={() => window.history.go(-1)}>
          Повернутися
        </Button>
      </Box>
      <Link to={"./reason"}>
        <Button variant="green">Далі</Button>
      </Link>
    </Flex>
  </>
);

const Reason = ({
  id: legalEntityToId,
  legalEntity: {
    owner,
    id: legalEntityFromId,
    name: legalEntityFromName,
    edrpou: legalEntityFromEdrpou
  },
  navigate
}) => (
  <Box pt={1} px={5}>
    <DefinitionListView
      labels={{
        edrpou: "ЄДРПОУ",
        name: "Назва",
        owner: "Власник"
      }}
      data={{
        edrpou: legalEntityFromEdrpou,
        name: legalEntityFromName,
        owner: getFullName(owner.party)
      }}
    />
    <DefinitionListView
      labels={{
        id: "ID медзакладу"
      }}
      data={{
        id: legalEntityFromId
      }}
      color="#7F8FA4"
    />
    <Box width={460} pt={2}>
      <Query query={LegalEntityQuery} variables={{ id: legalEntityToId }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          const {
            legalEntity: { id, name, edrpou }
          } = data;
          const legalEntityTo = { id, name, edrpou };
          const legalEntityFrom = {
            id: legalEntityFromId,
            name: legalEntityFromName,
            edrpou: legalEntityFromEdrpou
          };
          return (
            <Form
              onSubmit={async ({ base }) => {
                navigate("../sign", {
                  state: {
                    legalEntityFrom,
                    legalEntityTo,
                    base
                  }
                });
              }}
            >
              <Field.Textarea
                name="base"
                rows={6}
                label="Вкажіть підставу підпорядкування"
                placeholder="Приклад: Наказ КМУ № 73465"
              />
              <Validation.Required
                field="base"
                message="Обов&#700;язкове поле"
              />
              <Flex>
                <Box mr={3}>
                  <Button variant="blue" onClick={() => window.history.go(-1)}>
                    Повернутися
                  </Button>
                </Box>
                <Button variant="green">Далі</Button>
              </Flex>
            </Form>
          );
        }}
      </Query>
    </Box>
  </Box>
);

const Sign = ({
  location: {
    state: { legalEntityFrom, legalEntityTo, base }
  },
  navigate
}) => (
  <Box px={5}>
    <Signer.Parent
      url={REACT_APP_SIGNER_URL}
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
                  base: "Підстава підпорядкування"
                }}
                data={{ base }}
              />
              <Tooltip
                component={() => (
                  <Button
                    variant="green"
                    onClick={async () => {
                      const mergedLegalEntities = {
                        merge_from_legal_entity: legalEntityFrom,
                        merge_to_legal_entity: legalEntityTo,
                        base
                      };
                      const { signedContent } = await signData(
                        mergedLegalEntities
                      );
                      await mergeLegalEntities({
                        variables: {
                          signedContent: {
                            signedContent,
                            signedContentEncoding: "BASE64"
                          }
                        }
                      });
                      navigate("/jobs");
                    }}
                  >
                    Підписати
                  </Button>
                )}
                content={
                  <>
                    Увага! <br />
                    Затверджуючи запит, ПІДТВЕРДЖУЄТЕ дійсність власних намірів
                    , а також що зміст правочину ВІДПОВІДАЄ ВАШІЇЙ ВОЛІ,
                    ПРИЙНЯТИЙ ТА ПІДПИСАНИЙ ОСОБИСТО ВАМИ.
                  </>
                }
              />
            </>
          )}
        </Mutation>
      )}
    </Signer.Parent>
  </Box>
);

const Line = system({
  is: "figure",
  bg: "shiningKnight",
  my: 5,
  mx: 0,
  height: "1px",
  w: "100%"
});

export default Add;
