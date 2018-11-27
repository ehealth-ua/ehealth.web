import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";

import { Form, Modal, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import AddressView from "../../components/AddressView";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

const PersonDeclarationsQuery = loader(
  "../../graphql/PersonDeclarationsQuery.graphql"
);
const ResetAuthMethodMutation = loader(
  "../../graphql/ResetAuthMethodMutation.graphql"
);
const PersonQuery = loader("../../graphql/PersonQuery.graphql");

const filterData = (type, arr) => arr.filter(t => t.type === type);

const declarationStatuses = Object.entries(STATUSES.DECLARATION).map(
  ([name, value]) => ({ name, value })
);

const Details = ({ id }) => (
  <Query query={PersonQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        status,
        firstName,
        secondName,
        lastName,
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        phones,
        authenticationMethods
      } = data.person;

      const [mobilePhone] = filterData("MOBILE", phones);
      const [landLinePhone] = filterData("LAND_LINE", phones);
      const authInfo = authenticationMethods[0];

      const userInfo = {
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        mobilePhone: mobilePhone && mobilePhone.number,
        landLinePhone: landLinePhone && landLinePhone.number
      };

      return (
        <>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/persons">
                  Пошук пацієнтів
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі пацієнта</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <DefinitionListView
              labels={{
                id: "ID пацієнта",
                fullName: "ПІБ пацієнта",
                status: "Статус"
              }}
              data={{
                id,
                fullName: getFullName({ firstName, secondName, lastName }),
                status: <Badge name={status} type="PERSON" minWidth={100} />
              }}
              color="#7F8FA4"
              labelWidth="100px"
            />
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">Особиста інформація</Tabs.NavItem>
            <Tabs.NavItem to="./auth">Метод аутентифікації</Tabs.NavItem>
            <Tabs.NavItem to="./declarations">Декларації</Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <UserInfo path="/" userInfo={userInfo} />
              <AuthInfo path="auth" authInfo={authInfo} />
              <DeclarationsInfo path="declarations" />
            </Router>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const UserInfo = ({ userInfo }) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        birthDate: "Дата народження",
        birthCountry: "Країна народження",
        birthSettlement: "Місце народження",
        taxId: "ІНН",
        unzr: "ID Запису в ЄДДР",
        mobilePhone: (
          <>
            Мобільний номер
            <br /> телефон
          </>
        ),
        landLinePhone: (
          <>
            Стаціонарний номер
            <br /> телефону
          </>
        )
      }}
      data={userInfo}
    />
  </Box>
);

const AuthInfo = ({ id, authInfo }) =>
  authInfo ? (
    <Box p={5}>
      <DefinitionListView
        labels={{
          type: "Тип аутентифікації",
          phoneNumber: "Номер телефону"
        }}
        data={authInfo}
      />
      {authInfo.type !== "NA" && (
        <Box>
          <Mutation mutation={ResetAuthMethodMutation}>
            {resetPersonAuthenticationMethod => (
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <Button variant="green" disabled={opened} onClick={toggle}>
                      Скинути метод аутентифікації
                    </Button>
                    {opened && (
                      <Modal width={760} backdrop>
                        <Heading as="h1" fontWeight="normal" mb={6}>
                          Зміна методу аутентифікації
                        </Heading>
                        <Text lineHeight={2} textAlign="center" mb={6}>
                          Увага! <br />
                          Після підтвердження, метод аутентифікації буде змінено
                          на невизначений
                        </Text>
                        <Flex justifyContent="center">
                          <Box mx={2}>
                            <Button variant="blue" onClick={toggle}>
                              Повернутися
                            </Button>
                          </Box>
                          <Box mx={2}>
                            <Button
                              variant="green"
                              onClick={async () => {
                                await resetPersonAuthenticationMethod({
                                  variables: { id }
                                });
                                toggle();
                              }}
                            >
                              Скинути метод аутентифікації
                            </Button>
                          </Box>
                        </Flex>
                      </Modal>
                    )}
                  </>
                )}
              </BooleanValue>
            )}
          </Mutation>
        </Box>
      )}
    </Box>
  ) : null;

const DeclarationsInfo = ({ id }) => (
  <LocationParams>
    {({
      locationParams: { orderBy, declarationId, status },
      setLocationParams
    }) => {
      return (
        <Query
          query={PersonDeclarationsQuery}
          variables={{
            id,
            filter: { declarationId, status: status && status.name },
            orderBy
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const {
              person: { declarations }
            } = data;
            return (
              <>
                <Form
                  onSubmit={() => null /* NOT USED, but required */}
                  initialValues={{ declarationId, status }}
                >
                  <Form.AutoSubmit onSubmit={setLocationParams} />
                  <Flex>
                    <Box px={5} pt={5} width={460}>
                      <Field.Text
                        name="declarationId"
                        label="Пошук декларації"
                        placeholder="Введіть ID або номер декларації"
                        postfix={<AdminSearchIcon color="#CED0DA" />}
                      />
                    </Box>
                    <Box pt={5}>
                      <Field.Select
                        name="status"
                        label="Статус декларації"
                        items={[
                          { value: "всі статуси", name: undefined },
                          ...declarationStatuses
                        ]}
                        renderItem={item => item.value}
                        itemToString={item => {
                          if (!item) return "всі статуси";
                          return typeof item === "string" ? item : item.value;
                        }}
                        filterOptions={{ keys: ["value"] }}
                        type="select"
                      />
                    </Box>
                  </Flex>
                </Form>
                <Table
                  data={declarations}
                  header={{
                    id: "ID декларації",
                    declarationNumber: "Номер декларації",
                    startDate: "Декларація діє з",
                    name: "Медзаклад",
                    edrpou: "ЄДРПОУ",
                    divisionName: "Назва відділення",
                    address: "Адреса",
                    status: "Статус",
                    action: "Дія"
                  }}
                  renderRow={({
                    id,
                    declarationNumber,
                    startDate,
                    legalEntity: { edrpou, name, addresses },
                    division: { name: divisionName },
                    status
                  }) => {
                    const [residenceAddress] = addresses.filter(
                      a => a.type === "RESIDENCE"
                    );
                    return {
                      id,
                      declarationNumber,
                      startDate,
                      name,
                      edrpou,
                      divisionName,
                      address: residenceAddress && (
                        <AddressView data={residenceAddress} />
                      ),
                      status: (
                        <Badge
                          name={status}
                          type="DECLARATION"
                          display="block"
                        />
                      ),
                      action: (
                        <Link to={`/declarations/${id}`}>Показати деталі</Link>
                      )
                    };
                  }}
                  sortableFields={["startDate", "status"]}
                  sortingParams={parseSortingParams(orderBy)}
                  onSortingChange={sortingParams =>
                    setLocationParams({
                      orderBy: stringifySortingParams(sortingParams)
                    })
                  }
                  hiddenFields="id"
                />
              </>
            );
          }}
        </Query>
      );
    }}
  </LocationParams>
);

export default Details;
