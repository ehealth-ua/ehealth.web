import React from "react";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import { Box } from "rebass/emotion";

import { PositiveIcon } from "@ehealth/icons";
import { getFullName, getPhones } from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import AddressView from "../../components/AddressView";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

import DeclarationQuery from "../../graphql/DeclarationQuery.graphql";

const Details = ({ id }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        declarationNumber,
        startDate,
        endDate,
        status,
        scope,
        reason,
        declarationRequestId,
        legalEntity,
        division,
        employee,
        person
      } = data.declaration;

      const general = {
        declarationNumber,
        startDate,
        endDate,
        status: STATUSES.DECLARATION[status],
        scope,
        reason
      };
      return (
        <>
          <Box p={6}>
            <DefinitionListView
              labels={{
                id: "ID пацієнта",
                declarationRequestId: "ID запиту",
                status: "Статус"
              }}
              data={{
                id,
                declarationRequestId,
                status: (
                  <Badge bg="darkPastelGreen" minWidth={100}>
                    {STATUSES.DECLARATION[status]}
                  </Badge>
                )
              }}
              color="#7F8FA4"
              labelWidth="100px"
            />
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">Медзаклад</Tabs.NavItem>
            <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            <Tabs.NavItem to="./employee">Лікар</Tabs.NavItem>
            <Tabs.NavItem to="./patient">Пацієнт</Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Box p={5}>
              <Router>
                <GeneralInfo path="/" general={general} />
                <LegalEntity path="/legal-entity" legalEntity={legalEntity} />
                <Division path="/divisions" division={division} />
                <Employee path="/employee" employee={employee} />
                <Patient path="/patient" patient={person} />
              </Router>
            </Box>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const GeneralInfo = ({ general }) => (
  <DefinitionListView
    labels={{
      declarationNumber: "Номер декларації",
      startDate: "Початкова дата дії декларації",
      endDate: "Кінцева дата дії декларації",
      status: "Статус",
      scope: "Тип",
      reason: "Причина розірвання"
    }}
    data={general}
  />
);

const LegalEntity = ({
  legalEntity: { edrpou, publicName, addresses, id }
}) => {
  const [activeAddress] = addresses.filter(a => a.type === "ACTIVE");
  return (
    <>
      <DefinitionListView
        labels={{
          edrpou: "ЄДРПОУ",
          publicName: "Назва",
          addresses: "Адреса"
        }}
        data={{
          edrpou,
          publicName,
          addresses: activeAddress && <AddressView data={activeAddress} />
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID медзакладу",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/legal-entities/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Division = ({
  division: { id, addresses, phones, mountainGroup, ...division }
}) => {
  const [activeAddress] = addresses.filter(a => a.type === "ACTIVE");
  return (
    <>
      <DefinitionListView
        labels={{
          name: "Назва",
          addresses: "Адреса",
          mountainGroup: "Гірський регіон",
          phones: "Номер телефону",
          email: "Email"
        }}
        data={{
          addresses: activeAddress && <AddressView data={activeAddress} />,
          phones: getPhones(phones),
          mountainGroup: mountainGroup ? <PositiveIcon /> : null,
          ...division
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID відділення",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/division/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Employee = ({
  employee: {
    id,
    position,
    party,
    doctor: { specialities }
  }
}) => {
  const [specialityOfficio] = specialities.filter(s => s.specialityOfficio);
  return (
    <>
      <DefinitionListView
        labels={{
          fullName: "Повне ім’я",
          speciality: "Спеціальність",
          position: "Посада"
        }}
        data={{
          fullName: getFullName(party),
          speciality: specialityOfficio && specialityOfficio.speciality,
          position
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID лікаря",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/employees/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Patient = ({
  patient: {
    id,
    birthDate,
    taxId,
    phones,
    birthCountry,
    birthSettlement,
    ...fullName
  }
}) => (
  <>
    <DefinitionListView
      labels={{
        fullName: "Повне ім’я",
        birthDate: "Дата народження",
        birthCountry: "Країна народження",
        birthSettlement: "Місце народження",
        taxId: "ІНН",
        phones: "Номер телефону"
      }}
      data={{
        fullName: getFullName(fullName),
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        phones: getPhones(phones)
      }}
    />
    <DefinitionListView
      labels={{
        id: "ID пацієнта",
        link: ""
      }}
      data={{
        id,
        link: (
          <Link to={`/persons/${id}`} fontWeight={700}>
            Показати детальну інформацію
          </Link>
        )
      }}
      color="#7F8FA4"
    />
  </>
);

export default Details;
