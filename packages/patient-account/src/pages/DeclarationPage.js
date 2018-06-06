import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import format from "date-fns/format";
import ReactDOM from "react-dom";
import { Link as RouterLink } from "react-router-dom";
import { withRouter } from "react-router";
import { injectGlobal } from "react-emotion/macro";

import { MozLogoIcon, CircleIcon } from "@ehealth/icons";
import { Title, Button, Link, Switch } from "@ehealth/components";

import DefinitionListView from "../components/DefinitionListView";
import FixedBlock from "../components/FixedBlock";
import DECLARATION_STATUSES from "../helpers/statuses";

const DeclarationQuery = gql`
  query Declaration($id: ID!) {
    declaration(id: $id)
      @rest(
        path: "/cabinet/declarations/:id"
        params: { id: $id }
        type: "DeclarationPayload"
      ) {
      data
    }
  }
`;

const DeclarationPage = ({ router: { route, history } }) => (
  <Query query={DeclarationQuery} variables={{ id: route.match.params.id }}>
    {({ loading, error, data }) => {
      if (!data.declaration) return null;
      const {
        id,
        declaration_number: declarationNumber,
        signed_at: signedAt,
        status,
        content,
        person: {
          last_name: lastName,
          first_name: firstName,
          second_name: secondName,
          birth_date: birthDate,
          birth_settlement: birthSettlement,
          birth_country: birthCountry,
          gender,
          tax_id: taxId,
          phones: [{ number }],
          emergency_contact: emergencyContact,
          confidant_person: confidantPerson,
          employee
        },
        employee: {
          position,
          party: employeeFullName,
          doctor: {
            specialities,
            science_degree: scienceDegree,
            qualifications,
            educations
          }
        },
        legal_entity: {
          name: legalEntityName,
          phones: [{ number: legalEntityPhone }]
        },
        division: {
          name: divisionName,
          phones: [{ number: divisionPhone }],
          addresses: [
            {
              area,
              settlement_type: settlementType,
              settlement,
              street_type: streetType,
              street,
              building,
              apartment
            }
          ]
        }
      } = data.declaration.data;
      return (
        <>
          <Shadow>
            <DeclarationHeader
              id={id}
              declaration_number={declarationNumber}
              signed_at={signedAt}
            />
            <DefinitionListSection>
              <SubTitle>Пацієнт</SubTitle>
              <Flex>
                <FlexItem>
                  <DefinitionListView
                    labels={{
                      lastName: "Прізвище",
                      firstName: "Ім'я",
                      secondName: "По-батькові",
                      birthDate: "Дата народження",
                      birthCountry: "Країна народження",
                      birthSettlement: "Місто народження",
                      gender: "Стать"
                    }}
                    data={{
                      lastName,
                      firstName,
                      secondName,
                      birthDate: format(birthDate, "DD.MM.YYYY"),
                      birthSettlement,
                      birthCountry,
                      gender
                    }}
                  />
                </FlexItem>
                <FlexItem>
                  <DefinitionListView
                    labels={{
                      taxId: "Номер облікової картки",
                      number: "Контактний номер телефону"
                    }}
                    data={{
                      taxId,
                      number
                    }}
                  />
                </FlexItem>
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
                  full_name: `${emergencyContact.first_name} ${
                    emergencyContact.second_name
                  } ${emergencyContact.last_name}`,
                  number: emergencyContact.phones[0].number
                }}
              />
            </DefinitionListSection>
            {confidantPerson && (
              <DefinitionListSection>
                <SubTitle>Законні представники пацієнта</SubTitle>
                {confidantPerson.map(
                  ({
                    first_name: firstName,
                    second_name: secondName,
                    last_name: lastName,
                    phones: [{ number }],
                    documents_person: documentsPerson,
                    documents_relationship: documentsRelationship
                  }) => (
                    <Flex>
                      <FlexItem>
                        <DefinitionListView
                          labels={{
                            full_name: "ПІБ",
                            number: "Контактний номер телефону",
                            document:
                              "Документ, що посвідчує особу законного представника"
                          }}
                          data={{
                            full_name: `${firstName} ${secondName} ${lastName}`,
                            number,
                            document: `${documentsPerson[0].type} ${
                              documentsPerson[0].number
                            }`
                          }}
                        />
                      </FlexItem>
                      <FlexItem>
                        <DefinitionListView
                          labels={{
                            document:
                              "Документ, що посвідчує повноваження законного представника"
                          }}
                          data={{
                            document: `${documentsRelationship[0].type} #${
                              documentsRelationship[0].number
                            } від ${format(
                              documentsRelationship[0].issued_at,
                              "DD.MM.YYYY"
                            )}`
                          }}
                        />
                      </FlexItem>
                    </Flex>
                  )
                )}
              </DefinitionListSection>
            )}
            <DefinitionListSection>
              <SubTitle>Лікар</SubTitle>
              <DefinitionListView
                labels={{
                  fullName: "ПІБ",
                  position: "Посада",
                  scienceDegree: "Спеціальність",
                  specialities: "Спеціальність за посадою",
                  level: "Рівень спеціалізації",
                  qualifications: "Тип кваліфікації",
                  issuedAt: "Ким та коли видано"
                }}
                data={{
                  fullName: `${employeeFullName.first_name} ${
                    employeeFullName.second_name
                  } ${employeeFullName.last_name}`,
                  position,
                  scienceDegree: scienceDegree.speciality,
                  specialities: specialities[0].speciality,
                  level: specialities[0].level,
                  qualifications: `${qualifications[0].type} ${
                    qualifications[0].certificate_number
                  }`,
                  issuedAt: `${qualifications[0].institution_name} від ${format(
                    qualifications[0].issued_date,
                    "DD.MM.YYYY"
                  )}`
                }}
              />
            </DefinitionListSection>
            <DefinitionListSection>
              <SubTitle>Відділення</SubTitle>
              <Flex>
                <FlexItem>
                  <DefinitionListView
                    labels={{
                      divisionName: "Назва відділення",
                      legalEntityName: "Назва меличного закладу",
                      legalEntityPhone: "Телефон меличного закладу"
                    }}
                    data={{
                      divisionName,
                      legalEntityName,
                      legalEntityPhone
                    }}
                  />
                </FlexItem>
                <FlexItem>
                  <DefinitionListView
                    labels={{
                      divisionPhone: "Контактний номер телефону відділення",
                      divisionAddress: "Адреса відділення"
                    }}
                    data={{
                      divisionPhone,
                      divisionAddress: (
                        <>
                          {area} {settlementType} {settlement} {streetType}{" "}
                          {street}
                          {", "}
                          {building}
                          {", кв. "}
                          {apartment}
                        </>
                      )
                    }}
                  />
                </FlexItem>
              </Flex>
            </DefinitionListSection>
            <DefinitionListSection>
              <DefinitionListView
                labels={{ signedAt: "Дата ухвалення" }}
                data={{ signedAt: format(signedAt, "DD.MM.YYYY") }}
              />
            </DefinitionListSection>
          </Shadow>
          <FixedBlock>
            <Link size="small" upperCase bold onClick={history.goBack}>
              Повернутись
            </Link>
            <Switch
              value={status}
              active={
                <>
                  <Button
                    size="small"
                    upperCase
                    bold
                    onClick={() => window.print()}
                  >
                    {" "}
                    Роздрукувати декларацію
                  </Button>
                </>
              }
              terminated={
                <Title.H3>
                  Статус декларації: <b>{DECLARATION_STATUSES[status]}</b>{" "}
                  <CircleIcon stroke="#ec2257" strokeWidth="4" />
                </Title.H3>
              }
            />
          </FixedBlock>
          {ReactDOM.createPortal(
            <div
              id="print-root"
              dangerouslySetInnerHTML={{ __html: content }}
            />,
            document.body
          )}
        </>
      );
    }}
  </Query>
);

export default withRouter(DeclarationPage);

injectGlobal`
  @media screen {
    #print-root {
      display: none;
    }
  }
  @media print {
    #root {
      display: none;
    }
  }
`;

export const DeclarationHeader = ({
  id,
  declaration_number,
  signed_at,
  wrap
}) => {
  const start_block = (
    <Flex>
      <MozLogoIcon height="100px" />
      <Left>
        <H1>Декларація</H1>
        <H3>
          про вибір лікаря з надання первинної допомоги
          <br />
          № {declaration_number} від {format(signed_at, "DD.MM.YYYY")}
        </H3>
      </Left>
    </Flex>
  );
  return wrap ? (
    <RouterLink to={`/declarations/${id}`}>
      <Shadow>{start_block}</Shadow>
    </RouterLink>
  ) : (
    start_block
  );
};

const Shadow = styled.div`
  box-shadow: 0 0 18px rgba(174, 174, 174, 0.75);
  border: 1px solid rgba(72, 128, 237, 0.15);
  padding: 40px;
`;

const H1 = styled.h1`
  font-size: 32px;
  color: #292b37;
  text-transform: uppercase;
  margin: 0;
`;
const H3 = styled.h3`
  font-size: 16px;
  color: #292b37;
  margin: 0;
`;

const Left = styled.div`
  margin-left: 20px;
`;

const DefinitionListSection = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const FlexItem = styled.div`
  flex: 1 1 50%;
`;

const SubTitle = styled.h3`
  margin-bottom: 30px;
  font-size: 16px;
`;
