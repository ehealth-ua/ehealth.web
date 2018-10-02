import React from "react";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import system from "system-components/emotion";

import LegalEntityQuery from "../../graphql/LegalEntityQuery.graphql";
import { Box } from "rebass/emotion";

import { PositiveIcon } from "@ehealth/icons";
import { getFullName, getPhones } from "@ehealth/utils";

import Table from "../../components/Table";
import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

const Details = ({ id }) => (
  <Query query={LegalEntityQuery} variables={{ id }}>
    {({ loading, error, data: { legalEntity } }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        status,
        edrpou,
        name,
        addresses,
        phones,
        email,
        type,
        ownerPropertyType,
        kveds,
        misVerified,
        nhsVerified,
        mergedFromLegalEntities,
        owner,
        divisions,
        medicalServiceProvider
      } = legalEntity;
      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/legal-entities">
                  Пошук медзакладу
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі медзакладу</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <DefinitionListView
              labels={{
                id: "ID медзакладу",
                status: "Статус"
              }}
              data={{
                id,
                status: (
                  <Badge name={status} type="LEGALENTITY" minWidth={100} />
                )
              }}
              color="#7F8FA4"
              labelWidth="100px"
            />
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./licenses">Ліцензії</Tabs.NavItem>
            <Tabs.NavItem to="./related-legal-entities">
              Підпорядковані медзаклади
            </Tabs.NavItem>
            <Tabs.NavItem to="./owner">Власник</Tabs.NavItem>
            <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            <Tabs.NavItem to="./requests-for-contract">
              Запити на контракт
            </Tabs.NavItem>
            <Tabs.NavItem to="./contracts">Контракти</Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Box p={5}>
              <Router>
                <GeneralInfo
                  path="/"
                  edrpou={edrpou}
                  name={name}
                  addresses={addresses}
                  phones={phones}
                  email={email}
                  type={type}
                  ownerPropertyType={ownerPropertyType}
                  kveds={kveds}
                  misVerified={misVerified}
                  nhsVerified={nhsVerified}
                />
                <License path="/licenses" license={medicalServiceProvider} />
                <RelatedLegalEntities
                  path="/related-legal-entities"
                  legalEntity={mergedFromLegalEntities}
                />
                <Owner path="/owner" owner={owner} />
                <Divisions path="/divisions" divisions={divisions} />
              </Router>
            </Box>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  addresses,
  phones,
  type,
  ownerPropertyType,
  kveds,
  misVerified,
  nhsVerified,
  ...props
}) => (
  <>
    <DefinitionListView
      labels={{
        edrpou: "ЄДРПОУ",
        name: "Назва",
        addresses: "Адреса",
        phones: "Номер телефону",
        email: "Email",
        type: "Тип"
      }}
      data={{
        ...props,
        addresses: addresses
          .filter(a => a.type === "ACTIVE")
          .map(item => <AddressView data={item} />),
        phones: getPhones(phones),
        type: STATUSES.LEGAL_ENTITY_TYPE[type]
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        ownerPropertyType: "Тип власності",
        kveds: "КВЕДи",
        misVerified: <GreyTitle>Верифікація МІС</GreyTitle>,
        nhsVerified: <GreyTitle>Верифікація НСЗУ</GreyTitle>
      }}
      data={{
        ownerPropertyType,
        kveds: kveds.map((el, key, arr) => (
          <>
            {el}
            {key !== arr.length - 1 && ", "}
          </>
        )),
        misVerified: misVerified && <PositiveIcon />,
        nhsVerified: nhsVerified && <PositiveIcon />
      }}
    />
  </>
);
const License = ({ license: { accreditation, licenses = [] } }) => {
  const { issuedDate, expiryDate } = accreditation;
  return (
    <>
      <DefinitionListView
        labels={{
          category: "Акредитація",
          validateDate: "Термін дії"
        }}
        data={{
          ...accreditation,
          validateDate: `з ${issuedDate} по ${expiryDate}`
        }}
      />
      <Line />
      {licenses.map(({ issuedDate, expiryDate, ...item }, index, array) => (
        <React.Fragment key={index}>
          <DefinitionListView
            labels={{
              licenseNumber: "Ліцензія",
              validateDate: "Термін дії",
              whatLicensed: "Орган, що видав",
              activeFromDate: "Актуальність"
            }}
            data={{
              ...item,
              validateDate: `з ${issuedDate} по ${expiryDate}`
            }}
          />
          {array.length - 1 !== index && <Line />}
        </React.Fragment>
      ))}
    </>
  );
};
const RelatedLegalEntities = ({ legalEntity }) => <>RelatedLegalEntities</>;

const Owner = ({ owner: { party, id, position, doctor } }) => (
  <DefinitionListView
    labels={{
      party: "ПІБ",
      speciality: "Спеціальність",
      position: "Посада",
      id: <GreyTitle>Id</GreyTitle>
    }}
    data={{
      party: getFullName(party),
      speciality: doctor.specialities.map(({ speciality }, index, array) => (
        <React.Fragment key={index}>
          {speciality}
          {array.length - 1 !== index && ", "}
        </React.Fragment>
      )),
      position,
      id: <GreyTitle>{id}</GreyTitle>
    }}
  />
);
const Divisions = ({ divisions }) => <>Divisions</>;

const Line = system({
  is: "figure",
  bg: "shiningKnight",
  my: 5,
  mx: 0,
  height: "1px",
  w: "100%"
});

const GreyTitle = system({
  color: "shiningKnight",
  fontWeight: 500
});

export default Details;
