import React from "react";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Flex, Box } from "rebass/emotion";

import { Form } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import { AdminTable } from "../../components/Table";
import AddressView from "../../components/AddressView";
import LocationParams from "../../components/LocationParams";
import DefinitionListView from "../../components/DefinitionListView";

import DECLARATION_STATUSES from "../../helpers/statuses";

import PatientQuery from "../../graphql/PatientQuery.graphql";
import PatientDeclarationQuery from "../../graphql/PatientDeclarationQuery.graphql";

import { getFullName } from "@ehealth/utils";

const filterData = (type, arr) => arr.filter(t => t.type === type);

const declarationStatuses = Object.entries(DECLARATION_STATUSES).map(
  ([name, value]) => ({ value, name })
);

const Details = ({ id }) => (
  <Query query={PatientQuery} variables={{ id }}>
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
                    {status}
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

const AuthInfo = ({ authInfo }) =>
  authInfo ? (
    <Box p={5}>
      <DefinitionListView
        labels={{
          type: "Тип аутентифікації",
          phoneNumber: "Номер телефону"
        }}
        data={authInfo}
      />
      <Box>
        <Form
          onSubmit={() => {
            alert("Submit");
          }}
        >
          <Button variant="green">Скинути метод аутентифікації</Button>
        </Form>
      </Box>
    </Box>
  ) : null;

const DeclarationsInfo = ({ id }) => (
  <LocationParams>
    {({
      locationParams: { sort = "", declarationId, ...searchParamsRest },
      setLocationParams
    }) => {
      const [sortBy, orderBy] = sort.split("_");
      return (
        <Query
          query={PatientDeclarationQuery}
          variables={{ id, filter: { declarationId } }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const {
              person: { declarations }
            } = data;

            return (
              <>
                <Form onSubmit={values => setLocationParams(values)}>
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
                <AdminTable
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
                  }) => ({
                    id,
                    declarationNumber,
                    startDate,
                    name,
                    edrpou,
                    divisionName,
                    address: <AddressView data={addresses} />,
                    status: DECLARATION_STATUSES[status],
                    action: (
                      <Link to={`/declaration/${id}`}>Показати деталі</Link>
                    )
                  })}
                  sortElements={["startDate", "status"]}
                  sortParams={{ sortBy, sortEncrease: orderBy === "DESC" }}
                  onSort={({ sortBy, sortEncrease, ...props }) =>
                    setLocationParams({
                      ...searchParamsRest,
                      orderBy: [sortBy, sortEncrease ? "DESC" : "ASC"].join("_")
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
