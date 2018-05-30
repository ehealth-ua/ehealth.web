import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import format from "date-fns/format";

import { Title, Link } from "@ehealth/components";
import DefinitionListView from "../components/DefinitionListView";

const DeclarationQuery = gql`
  query {
    declaration(id: $id)
      @rest(
        path: "/cabinet/declarations/2f7353f1-0234-4407-b53a-41e6f4bbebcb"
        params: { id: $id }
        type: "DeclarationPayload"
      ) {
      data
    }
  }
`;

const DeclarationPreview = ({}) => (
  <Query query={DeclarationQuery}>
    {({ loading, error, data }) => {
      if (!data.declaration) return null;
      console.log("data", data);
      const {
        signed_at,
        person: {
          last_name,
          first_name,
          second_name,
          birth_date,
          birth_settlement,
          birth_country,
          gender,
          tax_id,
          phones: [{ number }],
          emergency_contact,
          confidant_person,
          employee
        },
        employee: {
          position,
          party: employee_full_name,
          doctor: { specialities, science_degree, qualifications, educations }
        },
        legal_entity: {
          name: legal_entity_name,
          phones: [{ number: legal_entity_phone }]
        },
        division: {
          name: division_name,
          phones: [{ number: division_phone }],
          addresses: [
            {
              area,
              settlement_type,
              settlement,
              street_type,
              street,
              building,
              apartment
            }
          ]
        }
      } = data.declaration.data;
      return (
        <>
          <Title.H1>Деталі декларації</Title.H1>
          <DefinitionListSection>
            <SubTitle>Пацієнт</SubTitle>
            <Flex>
              <div>
                <DefinitionListView
                  labels={{
                    last_name: "Прізвище",
                    first_name: "Ім'я",
                    second_name: "По-батькові",
                    birth_date: "Дата народження",
                    birth_country: "Країна народження",
                    birth_settlement: "Місто народження",
                    gender: "Стать"
                  }}
                  data={{
                    last_name,
                    first_name,
                    second_name,
                    birth_date,
                    birth_settlement,
                    birth_country,
                    gender
                  }}
                />
              </div>
              <div>
                <DefinitionListView
                  labels={{
                    tax_id: "Номер облікової картки",
                    number: "Контактний номер телефону"
                  }}
                  data={{
                    tax_id,
                    number
                  }}
                />
              </div>
            </Flex>
          </DefinitionListSection>
          <DefinitionListSection>
            <SubTitle>Контактна особа у разі екстренного випадку</SubTitle>
            <DefinitionListView
              labels={{
                full_name: "ПІБ",
                number: "Контактний номер телефону"
              }}
              data={{
                full_name: `${emergency_contact.first_name} ${
                  emergency_contact.second_name
                } ${emergency_contact.last_name}`,
                number: emergency_contact.phones[0].number
              }}
            />
          </DefinitionListSection>
          {confidant_person && (
            <DefinitionListSection>
              <SubTitle>Законні представники пацієнта</SubTitle>
              {confidant_person.map(
                ({
                  first_name,
                  second_name,
                  last_name,
                  phones: [{ number }],
                  documents_person,
                  documents_relationship
                }) => (
                  <Flex>
                    <div>
                      <DefinitionListView
                        labels={{
                          full_name: "ПІБ",
                          number: "Контактний номер телефону",
                          document:
                            "Документ, що посвідчує особу законного представника"
                        }}
                        data={{
                          full_name: `${first_name} ${second_name} ${last_name}`,
                          number,
                          document: `${documents_person[0].type} ${
                            documents_person[0].number
                          }`
                        }}
                      />
                    </div>
                    <div>
                      <DefinitionListView
                        labels={{
                          document:
                            "Документ, що посвідчує повноваження законного представника"
                        }}
                        data={{
                          document: `${documents_relationship[0].type} #${
                            documents_relationship[0].number
                          } від ${documents_relationship[0].issued_at}`
                        }}
                      />
                    </div>
                  </Flex>
                )
              )}
            </DefinitionListSection>
          )}
          <DefinitionListSection>
            <SubTitle>Лікар</SubTitle>
            <DefinitionListView
              labels={{
                full_name: "ПІБ",
                position: "Посада",
                science_degree: "Спеціальність",
                specialities: "Спеціальність за посадою",
                level: "Рівень спеціалізації",
                qualifications: "Тип кваліфікації",
                issued_at: "Ким та коли видано"
              }}
              data={{
                full_name: `${employee_full_name.first_name} ${
                  employee_full_name.second_name
                } ${employee_full_name.last_name}`,
                position,
                science_degree: science_degree.speciality,
                specialities: specialities[0].speciality,
                level: specialities[0].level,
                qualifications: `${qualifications[0].type} ${
                  qualifications[0].certificate_number
                }`,
                issued_at: `${qualifications[0].institution_name} від ${
                  qualifications[0].issued_date
                }`
              }}
            />
          </DefinitionListSection>
          <DefinitionListSection>
            <SubTitle>Відділення</SubTitle>
            <Flex>
              <div>
                <DefinitionListView
                  labels={{
                    division_name: "Назва відділення",
                    legal_entity_name: "Назва меличного закладу",
                    legal_entity_phone: "Телефон меличного закладу"
                  }}
                  data={{
                    division_name,
                    legal_entity_name,
                    legal_entity_phone
                  }}
                />
              </div>
              <div>
                <DefinitionListView
                  labels={{
                    division_phone: "Контактний номер телефону відділення",
                    division_address: "Адреса відділення"
                  }}
                  data={{
                    division_phone,
                    division_address: (
                      <>
                        {area} {settlement_type} {settlement} {street_type}{" "}
                        {street}
                        {", "}
                        {building}
                        {", кв. "}
                        {apartment}
                      </>
                    )
                  }}
                />
              </div>
            </Flex>
          </DefinitionListSection>
          <DefinitionListSection>
            <DefinitionListView
              labels={{ signed_at: "Дата ухвалення" }}
              data={{ signed_at: format(signed_at, "DD.MM.YYYY") }}
            />
          </DefinitionListSection>
        </>
      );
    }}
  </Query>
);

export default DeclarationPreview;

const DefinitionListSection = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  div {
    flex: 1 1 50%;
  }
`;

const SubTitle = styled.h3`
  display: flex;
  align-items: top;
  justify-content: space-between;
  margin-bottom: 30px;
  font-size: 16px;
`;
