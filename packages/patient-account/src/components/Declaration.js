import React from "react";
import styled from "react-emotion/macro";
import format from "date-fns/format";
import ReactDOM from "react-dom";
import {
  getDefinitions,
  getFullName,
  formatDate,
  formatPhone
} from "@ehealth/utils";
import * as Reach from "@reach/router";
import { ifProp } from "styled-tools";
import { injectGlobal } from "react-emotion/macro";
import { Mutation } from "react-apollo";
import printIframe from "print-iframe";

import { MozLogoIcon, CircleIcon } from "@ehealth/icons";
import { Heading, Button, Link, Switch } from "@ehealth/components";
import Section from "../components/Section";
import DefinitionListView from "./DefinitionListView";
import FixedBlock from "./FixedBlock";
import DictionaryValue from "./DictionaryValue";
import DECLARATION_STATUSES from "../helpers/statuses";
import AddressView from "./AddressView";

import ApproveDeclarationRequestMutation from "../graphql/ApproveDeclarationRequestMutation.graphql";

const DeclarationBody = ({ navigate, data }) => {
  const {
    id,
    declarationNumber,
    signedAt,
    status,
    content,
    person,
    employee,
    legalEntity,
    division
  } = data;

  const divisionAddresses = getDefinitions({
    data: division.addresses,
    keyExtractor: ({ type }) => `addresses.${type}`,
    renderLabel: ({ type }) => "Адреса відділення",
    renderItem: item => <AddressView data={item} />
  });

  const personPhones = getPhonesDefinitions(
    person.phones,
    "Контактний номер телефону"
  );

  const emergencyContact = getPhonesDefinitions(
    person.emergencyContact.phones,
    "Контактний номер телефону"
  );

  const divisionPhones = getPhonesDefinitions(
    division.phones,
    "Контактний номер телефону відділення"
  );

  const legalEntityPhones = getPhonesDefinitions(
    legalEntity.phones,
    "Телефон медичного закладу"
  );

  return (
    <div data-test="request">
      <Shadow>
        <DeclarationHeader
          id={id}
          declarationNumber={declarationNumber}
          signedAt={signedAt}
        />
        <Section>
          <Heading.H3 weight="bold">Пацієнт</Heading.H3>
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
                  ...person,
                  birthDate: formatDate(person.birthDate),
                  gender: <DictionaryValue name="GENDER" item={person.gender} />
                }}
              />
            </FlexItem>
            <FlexItem>
              <DefinitionListView
                labels={{
                  taxId: "Номер облікової картки",
                  ...personPhones.labels
                }}
                data={{
                  ...person,
                  ...personPhones.items
                }}
              />
            </FlexItem>
          </Flex>
        </Section>
        <Section>
          <Heading.H3 weight="bold">
            Контактна особа у разі екстренного випадку
          </Heading.H3>
          <DefinitionListView
            labels={{
              fullName: "ПІБ",
              ...emergencyContact.labels
            }}
            data={{
              fullName: getFullName(person.emergencyContact),
              ...emergencyContact.items
            }}
          />
        </Section>
        {person.confidantPerson && (
          <Section>
            <Heading.H3 weight="bold">Законні представники пацієнта</Heading.H3>
            {person.confidantPerson.map((data, item) => (
              <ConfidantItem {...data} key={item} />
            ))}
          </Section>
        )}
        <Section>
          <Heading.H3 weight="bold">Лікар</Heading.H3>
          <DefinitionListView
            labels={{
              fullName: "ПІБ",
              position: "Посада",
              specialities: "Спеціальність за посадою"
            }}
            data={{
              fullName: getFullName(employee.party),
              position: (
                <DictionaryValue name="POSITION" item={employee.position} />
              ),
              specialities: (
                <DictionaryValue
                  name="SPECIALITY_TYPE"
                  item={getSpeciality(employee)}
                />
              )
            }}
          />
        </Section>
        <Section>
          <Heading.H3 weight="bold">Відділення</Heading.H3>
          <Flex>
            <FlexItem>
              <DefinitionListView
                labels={{
                  name: "Назва відділення",
                  legalEntityName: "Назва медичного закладу",
                  ...legalEntityPhones.labels
                }}
                data={{
                  ...division,
                  legalEntityName: legalEntity.name,
                  ...legalEntityPhones.items
                }}
              />
            </FlexItem>
            <FlexItem>
              <DefinitionListView
                labels={{
                  ...divisionPhones.labels,
                  ...divisionAddresses.labels
                }}
                data={{
                  ...divisionPhones.items,
                  ...divisionAddresses.items
                }}
              />
            </FlexItem>
          </Flex>
        </Section>
        {signedAt && (
          <Section>
            <DefinitionListView
              labels={{ signedAt: "Дата ухвалення" }}
              data={{ signedAt: formatDate(signedAt) }}
            />
          </Section>
        )}
      </Shadow>
      <FixedBlock>
        <Link size="small" upperCase bold onClick={() => window.history.go(-1)}>
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
                onClick={() => printIframe(content)}
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
          NEW={
            <Mutation mutation={ApproveDeclarationRequestMutation}>
              {approveRequest => (
                <Button
                  size="small"
                  upperCase
                  bold
                  onClick={async () => {
                    try {
                      await approveRequest({
                        variables: { input: id }
                      });
                      navigate("/");
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  data-test="approve"
                >
                  Підтвердити запит на декларацію
                </Button>
              )}
            </Mutation>
          }
        />
      </FixedBlock>
      {ReactDOM.createPortal(
        <div id="print-root" dangerouslySetInnerHTML={{ __html: content }} />,
        document.body
      )}
    </div>
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
      <MozLogoIcon height="100px" width="160px" />
      <Left>
        <Heading.H1>Декларація</Heading.H1>
        <Heading.H3>
          про вибір лікаря з надання первинної допомоги
          <br />№ {declarationNumber}
          {signedAt && ` від ${format(signedAt, "DD.MM.YYYY")}`}
        </Heading.H3>
      </Left>
    </Flex>
  );

  return wrap ? (
    <Reach.Link to={`/${routerLinkTo}/${id}`}>
      <Shadow>{startBlock}</Shadow>
    </Reach.Link>
  ) : (
    startBlock
  );
};

const Shadow = styled.div`
  box-shadow: 0 0 18px rgba(174, 174, 174, 0.75);
  border: 1px solid rgba(72, 128, 237, 0.15);
  padding: 40px;
`;

const Left = styled.div`
  margin-left: 20px;
`;

const Flex = styled.div`
  display: flex;
  opacity: ${ifProp("blur", "0.5")};
  user-select: ${ifProp("blur", "none")};
`;

const FlexItem = styled.div`
  flex: 1 1 50%;
`;

const ConfidantItem = ({
  documentsPerson,
  documentsRelationship,
  phones,
  ...rest
}) => {
  const phonesDefinitions = getPhonesDefinitions(
    phones,
    "Контактний номер телефону"
  );
  const documents = getDefinitions({
    data: documentsPerson,
    keyExtractor: ({ type }) => `documents.${type}`,
    renderLabel: ({ type }) =>
      "Документ, що посвідчує особу законного представника",
    renderItem: item => (
      <>
        <DictionaryValue name={"DOCUMENT_TYPE"} item={item.type} /> №
        <DocumentItem data={item} />
      </>
    )
  });
  const documentsRelationshipDefinitions = getDefinitions({
    data: documentsRelationship,
    keyExtractor: ({ type }) => `documents.${type}`,
    renderLabel: ({ type }) =>
      "Документ, що посвідчує повноваження законного представника",
    renderItem: item => (
      <>
        <DictionaryValue name={"DOCUMENT_RELATIONSHIP_TYPE"} item={item.type} />{" "}
        №<DocumentItem data={item} />
      </>
    )
  });

  return (
    <Flex>
      <FlexItem>
        <DefinitionListView
          labels={{
            fullName: "ПІБ",
            ...phonesDefinitions.labels,
            ...documents.labels
          }}
          data={{
            fullName: getFullName(rest),
            ...phonesDefinitions.items,
            ...documents.items
          }}
        />
      </FlexItem>
      <FlexItem>
        <DefinitionListView
          labels={{
            ...documentsRelationshipDefinitions.labels
          }}
          data={{
            ...documentsRelationshipDefinitions.items
          }}
        />
      </FlexItem>
    </Flex>
  );
};

const DocumentItem = ({ data: { number, issuedBy, issuedAt } }) => (
  <>
    {number}
    {issuedBy && (
      <>
        <br />
        виданий {issuedBy} {issuedAt && formatDate(issuedAt)}
      </>
    )}
  </>
);

const getPhonesDefinitions = (data, labels) =>
  getDefinitions({
    data: data,
    keyExtractor: ({ type }) => `phones.${type}`,
    renderLabel: () => labels,
    renderItem: ({ number }) => formatPhone(number)
  });

const getSpeciality = data => {
  if (data.speciality) return data.speciality;
  const {
    doctor: { specialities: [{ speciality: _speciality } = {}] = [] } = {}
  } = data;
  return _speciality;
};
