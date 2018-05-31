import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { withRouter } from "react-router-dom";
import { Title, Link } from "@ehealth/components";

import DefinitionListView from "../components/DefinitionListView";

const DivisionPage = ({ match, history }) => (
  <Query
    query={gql`
      query($id: String!) {
        division(id: $id)
          @rest(
            path: "/divisions?id=:id"
            type: "DivisionPayload"
            endpoint: "stats"
          ) {
          data
        }
      }
    `}
    variables={{ id: match.params.id }}
  >
    {({ loading, error, data }) => {
      const { division } = data;
      if (!division) return null;

      const {
        data: [{ name, contacts, legal_entity: legalEntity }]
      } = division;

      return (
        <>
          <Title.H1>КРОК 1. ОБЕРІТЬ ЛІКАРЯ</Title.H1>
          <DefinitionListSection>
            <SubTitle>{name}</SubTitle>
            <DefinitionListView
              labels={{
                taxId: "ЄДРПОУ",
                medzaklad: "Медзаклад",
                contacts: "Контакти"
              }}
              data={{
                taxId: legalEntity.edrpou,
                medzaklad: legalEntity.name,
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
