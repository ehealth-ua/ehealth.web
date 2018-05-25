import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { getFullName } from "@ehealth/utils";
import { Title, Link } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";

import DefinitionListView from "../components/DefinitionListView";

const ProfileEditPage = () => (
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
        tax_id: taxId
      } = person;

      return (
        <>
          <Title.H1>мій профіль</Title.H1>
          <DefinitionListSection>
            <SubTitle>
              Персональні дані
              <Link
                to="/profile"
                size="xs"
                upperCase
                icon={<PencilIcon height="14" />}
                iconReverse
              >
                Вийти з режиму редагування
              </Link>
            </SubTitle>
            <DefinitionListView
              labels={{
                name: "ПІБ",
                birthDate: "Дата народження",
                birthCountry: "Країна народження",
                birthSettlement: "Місто народження",
                gender: "Стать",
                taxId: "ІНН"
              }}
              data={{
                name: getFullName(person),
                gender,
                birthDate,
                birthCountry,
                birthSettlement,
                taxId
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

const EditLink = styled.span`
  margin-left: auto;
  font-size: 10px;
  color: #4880ed;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
`;

export default ProfileEditPage;
