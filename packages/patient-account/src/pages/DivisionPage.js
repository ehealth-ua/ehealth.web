import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import { Heading, Link } from "@ehealth/components";

import DefinitionListView from "../components/DefinitionListView";
import DictionaryValue from "../components/DictionaryValue";
import { CabinetTable } from "@ehealth/components";
import { getFullName } from "@ehealth/utils";

import DivisionDetailsQuery from "../graphql/DivisionDetailsQuery.graphql";

const DivisionPage = ({ match, history }) => (
  <Query
    query={DivisionDetailsQuery}
    variables={{ id: match.params.id }}
    context={{ credentials: "same-origin" }}
    fetchPolicy="cache-first"
  >
    {({ loading, error, data }) => {
      const { division } = data;
      if (!division) return null;

      const { data: employees } = data.employees;

      const { data: [{ name, contacts, legalEntity }] } = division;

      return (
        <>
          <Heading.H1>КРОК 1. ОБЕРІТЬ ЛІКАРЯ</Heading.H1>
          <DefinitionListSection>
            <SubTitle>{name}</SubTitle>
            <DefinitionListView
              labels={{
                taxId: "ЄДРПОУ",
                legalEntityName: "Медзаклад",
                contacts: "Контакти"
              }}
              data={{
                taxId: legalEntity.edrpou,
                legalEntityName: legalEntity.name,
                contacts: (
                  <>
                    {contacts.phones.map((item, i) => (
                      <Text key={i}>{item.number}</Text>
                    ))}
                    <EmailLink href={`mailto:${contacts.email}`}>
                      {contacts.email}
                    </EmailLink>
                  </>
                )
              }}
            />
          </DefinitionListSection>
          {employees.length ? (
            <CabinetTable
              data={employees}
              header={{
                name: (
                  <>
                    ПІБ<br />лікаря
                  </>
                ),
                job: "Спеціальність",
                action: "Дія"
              }}
              renderRow={({ id, party }) => ({
                name: getFullName(party),
                job: (
                  <DictionaryValue
                    name="SPECIALITY_TYPE"
                    item={party.specialities[0].speciality}
                  />
                ),
                action: <Link to={`/employee/${id}`}>Показати деталі</Link>
              })}
              rowKeyExtractor={({ id }) => id}
            />
          ) : null}
          <br />
          <Link onClick={() => history.goBack()} size="xs" upperCase bold>
            Назад до результатів пошуку
          </Link>
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

const Text = styled.div`
  margin-top: 7px;
  &:first-child {
    margin-top: 0;
  }
`;

const EmailLink = styled.a`
  display: block;
  margin-top: 7px;
`;

export default withRouter(DivisionPage);
