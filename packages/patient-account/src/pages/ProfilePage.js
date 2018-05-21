import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { getFullName, getFullAddress, getPhones } from "@ehealth/utils";
import { Title, Link } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";

import DefinitionListView from "../components/DefinitionListView";

const ProfilePage = () => (
  <Query
    query={gql`
      query {
        person @rest(path: "/cabinet/persons/details", type: "PersonPayload") {
          data
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (!data.person) return null;
      const { data: person } = data.person;
      const {
        gender,
        birth_date: birthDate,
        birth_country: birthCountry,
        birth_settlement: birthSettlement,
        tax_id: taxId,
        secret,
        email,
        preferred_way_communication: preferredWayCommunication
      } = person;

      let passport = person.documents.map(
        i => (i.type === "PASSPORT" ? i.number : null)
      );

      let registrationAddress = person.addresses.filter(
        i => (i.type === "REGISTRATION" ? i : null)
      );

      let residenceAddress = person.addresses.filter(
        i => (i.type === "RESIDENCE" ? i : null)
      );

      return (
        <>
          <Title.H1>мій профіль</Title.H1>
          <DefinitionListSection>
            <SubTitle>
              Персональні дані
              <Link
                size="xs"
                to="/profile/edit"
                icon={<EditIcon height="14" width="14" />}
                rtl
              >
                Редагувати профіль
              </Link>
            </SubTitle>
            <DefinitionListView
              labels={{
                name: "ПІБ",
                birthDate: "Дата народження",
                birthCountry: "Країна народження",
                birthSettlement: "Місто народження",
                gender: "Стать"
              }}
              data={{
                name: getFullName(person),
                gender,
                birthDate,
                birthCountry,
                birthSettlement
              }}
            />
          </DefinitionListSection>
          <DefinitionListSection>
            <DefinitionListView
              labels={{
                taxId: "ІНН",
                passport: "Паспорт"
              }}
              data={{ taxId, passport }}
            />
          </DefinitionListSection>
          <DefinitionListSection>
            <DefinitionListView
              labels={{
                registrationAddress: "Адреса реєстрації",
                residence: "Адреса проживання",
                preferredWayCommunication: "Бажаний метод зв’язку",
                secret: "Слово-пароль"
              }}
              data={{
                secret,
                preferredWayCommunication,
                registrationAddress: getFullAddress(registrationAddress[0]),
                residence: getFullAddress(residenceAddress[0])
              }}
            />
          </DefinitionListSection>
          <DefinitionListSection>
            <SubTitle>Контактна особа у екстреному випадку</SubTitle>
            <DefinitionListView
              labels={{
                name: "ПІБ",
                phone: "Номер телефону"
              }}
              data={{
                name: getFullName(person.emergency_contact),
                phone: getPhones(person.emergency_contact.phones)
              }}
            />
          </DefinitionListSection>
          <DefinitionListSection>
            <SubTitle>Авторизація</SubTitle>
            <DefinitionListView
              labels={{
                email: "Email",
                phone: "Номер телефону"
              }}
              data={{
                email,
                phone: person.authentication_methods[0].phone_number
              }}
            />
          </DefinitionListSection>
        </>
      );
    }}
  </Query>
);

const DefinitionListSection = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;
  &:last-of-type {
    border-bottom: none;
  }
`;

const SubTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  font-size: 16px;
`;

const EditIcon = styled(PencilIcon)`
  margin-right: 5px;
  vertical-align: middle;
`;

export default ProfilePage;
