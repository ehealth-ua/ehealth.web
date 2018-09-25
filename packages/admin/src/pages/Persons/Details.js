import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box } from "rebass/emotion";

import { Form } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Table from "../../components/Table";
import AddressView from "../../components/AddressView";
import LocationParams from "../../components/LocationParams";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

import PersonQuery from "../../graphql/PersonQuery.graphql";
import ResetAuthMethodMutation from "../../graphql/ResetAuthMethodMutation.graphql";
import PersonDeclarationsQuery from "../../graphql/PersonDeclarationsQuery.graphql";

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
        authenticationMethod
      } = data.person;

      const [mobilePhone] = filterData("MOBILE", phones);
      const [landLinePhone] = filterData("LAND_LINE", phones);
      const [authInfo] = filterData("OTP", authenticationMethod);

      const userInfo = {
        fullName: getFullName({ firstName, secondName, lastName }),
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
            <DefinitionListView
              labels={{
                id: "ID пацієнта",
                status: "Статус"
              }}
              data={{
                id,
                status: (
                  <Badge bg="darkPastelGreen" minWidth={100}>
                    {STATUSES.PERSON[status]}
                  </Badge>
                )
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
        fullName: "ПІБ пацієнта",
        birthDate: "Дата народження",
        birthCountry: "Країна народження",
        birthSettlement: "Місце народження",
        taxId: "ІНН",
        unzr: (
          <>
            Серія та номер <br /> паспорту
          </>
        ),
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
              <Button
                variant="green"
                onClick={() =>
                  resetPersonAuthenticationMethod({
                    variables: { id }
                  })
                }
              >
                Скинути метод аутентифікації
              </Button>
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
                  <Form.AutoSubmit
                    onSubmit={values => {
                      setLocationParams(values);
                    }}
                  />
                  <Flex>
                    <Box p={5} width={460}>
                      <Field.Text
                        name="declarationId"
                        label="Пошук декларації"
                        placeholder="Введіть ID або номер декларації"
                        postfix={<AdminSearchIcon color="#CED0DA" />}
                      />
                    </Box>
                    <Box py={5}>
                      <Field.Select
                        name="status"
                        label="Статус декларації"
                        items={declarationStatuses}
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
                    const [activeAddress] = addresses.filter(
                      a => a.type === "ACTIVE"
                    );
                    return {
                      id,
                      declarationNumber,
                      startDate,
                      name,
                      edrpou,
                      divisionName,
                      address: activeAddress && (
                        <AddressView data={activeAddress} />
                      ),
                      status: STATUSES.DECLARATION[status],
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