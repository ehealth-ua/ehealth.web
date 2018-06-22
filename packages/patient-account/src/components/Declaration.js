import React from "react";
import styled from "react-emotion/macro";
import format from "date-fns/format";
import ReactDOM from "react-dom";
import { Link as RouterLink } from "react-router-dom";
import { ifProp } from "styled-tools";
import { injectGlobal } from "react-emotion/macro";

import { MozLogoIcon, CircleIcon } from "@ehealth/icons";
import { Heading, Button, Link, Switch } from "@ehealth/components";

import DefinitionListView from "./DefinitionListView";
import FixedBlock from "./FixedBlock";
import DictionaryValue from "./DictionaryValue";
import DECLARATION_STATUSES from "../helpers/statuses";

const DeclarationBody = ({ history, data }) => {
  console.log(data);
  const {
    id,
    declarationNumber,
    signedAt,
    status,
    content,
    person: {
      lastName,
      firstName,
      secondName,
      birthDate,
      birthSettlement,
      birthCountry,
      gender,
      taxId,
      phones: [{ number }],
      emergencyContact,
      confidantPerson,
      employee
    },
    employee: {
      position,
      party,
      doctor: { specialities, scienceDegree, qualifications, educations }
    },
    legalEntity: {
      name: legalEntityName,
      phones: [{ number: legalEntityPhone }]
    },
    division: {
      name: divisionName,
      phones: [{ number: divisionPhone }],
      addresses: [
        {
          area,
          settlementType,
          settlement,
          streetType,
          street,
          building,
          apartment
        }
      ]
    }
  } = data;

  return (
    <>
      <Shadow>
        <DeclarationHeader
          id={id}
          declarationNumber={declarationNumber}
          signedAt={signedAt}
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
                  gender: <DictionaryValue name="GENDER" item={gender} />
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
              fullName: "ПІБ",
              number: "Контактний номер телефону"
            }}
            data={{
              fullName: `${emergencyContact.firstName} ${
                emergencyContact.secondName
              } ${emergencyContact.lastName}`,
              number: emergencyContact.phones[0].number
            }}
          />
        </DefinitionListSection>
        {confidantPerson && (
          <DefinitionListSection>
            <SubTitle>Законні представники пацієнта</SubTitle>
            {confidantPerson.map(
              (
                {
                  firstName: firstName,
                  secondName: secondName,
                  lastName: lastName,
                  phones: [{ number }],
                  documentsPerson: documentsPerson,
                  documentsRelationship: documentsRelationship
                },
                item
              ) => (
                <Flex key={item}>
                  <FlexItem>
                    <DefinitionListView
                      labels={{
                        fullName: "ПІБ",
                        number: "Контактний номер телефону",
                        document:
                          "Документ, що посвідчує особу законного представника"
                      }}
                      data={{
                        fullName: `${firstName} ${secondName} ${lastName}`,
                        number,
                        document: (
                          <>
                            <DictionaryValue
                              name="DOCUMENT_TYPE"
                              item={documentsPerson[0].type}
                            />{" "}
                            №{documentsPerson[0].number}
                          </>
                        )
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
                        document: (
                          <>
                            <DictionaryValue
                              name="DOCUMENT_RELATIONSHIP_TYPE"
                              item={documentsRelationship[0].type}
                            />{" "}
                            №{documentsRelationship[0].number} від{" "}
                            {format(
                              documentsRelationship[0].issuedAt,
                              "DD.MM.YYYY"
                            )}
                          </>
                        )
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
              fullName: `${party.firstName} ${party.secondName} ${
                party.lastName
              }`,
              position: <DictionaryValue name="POSITION" item={position} />,
              scienceDegree: (
                <DictionaryValue
                  name="SPECIALITY_TYPE"
                  item={scienceDegree.speciality}
                />
              ),
              specialities: (
                <DictionaryValue
                  name="SPECIALITY_TYPE"
                  item={specialities[0].speciality}
                />
              ),
              level: (
                <DictionaryValue
                  name="SPECIALITY_LEVEL"
                  item={specialities[0].level}
                />
              ),
              qualifications: (
                <>
                  <DictionaryValue
                    name="QUALIFICATION_TYPE"
                    item={qualifications[0].type}
                  />{" "}
                  №{qualifications[0].certificateNumber}
                </>
              ),
              issuedAt: `${qualifications[0].institutionName} від ${format(
                qualifications[0].issuedDate,
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
                      {area}
                      {" область "}
                      <DictionaryValue
                        name="SETTLEMENT_TYPE"
                        item={settlementType}
                      />{" "}
                      {settlement}{" "}
                      <DictionaryValue name="STREET_TYPE" item={streetType} />{" "}
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
            <Heading.H3>
              Статус декларації: <b>{DECLARATION_STATUSES[status]}</b>{" "}
              <CircleIcon stroke="#ec2257" strokeWidth="4" />
            </Heading.H3>
          }
        />
      </FixedBlock>
      {ReactDOM.createPortal(
        <div id="print-root" dangerouslySetInnerHTML={{ __html: content }} />,
        document.body
      )}
    </>
  );
};

export default DeclarationBody;

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
  declarationNumber,
  signedAt,
  blur,
  type,
  wrap
}) => {
  const routerLinkTo =
    type === "declarationRequest" ? "declaration_requests" : "declarations";

  const startBlock = (
    <Flex blur={blur}>
      <MozLogoIcon height="100px" />
      <Left>
        <H1>Декларація</H1>
        <H3>
          про вибір лікаря з надання первинної допомоги
          <br />
          № {declarationNumber} від {format(signedAt, "DD.MM.YYYY")}
        </H3>
      </Left>
    </Flex>
  );

  return wrap ? (
    <RouterLink to={`/${routerLinkTo}/${id}`}>
      <Shadow>{startBlock}</Shadow>
    </RouterLink>
  ) : (
    startBlock
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
  opacity: ${ifProp("blur", "0.5")};
  user-select: ${ifProp("blur", "none")};
`;

const FlexItem = styled.div`
  flex: 1 1 50%;
`;

const SubTitle = styled.h3`
  margin-bottom: 30px;
  font-size: 16px;
`;
