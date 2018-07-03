import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { Heading, Link } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";
import Section from "../components/Section";
import DefinitionListView from "../components/DefinitionListView";
import AuthenticationFactorQuery from "../graphql/AuthenticationFactorQuery.graphql";
import { prop } from "styled-tools";
import {
  REACT_APP_UPDATE_FACTOR,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "../env";

const SecurityPage = () => (
  <Query query={AuthenticationFactorQuery}>
    {({ loading, error, data }) => {
      if (loading || error || !data.factor) return null;
      const { factor: { data: [{ factor }] } } = data;
      return (
        <>
          <Heading.H1>Безпека</Heading.H1>
          <Section>
            <Heading.H3 weight="bold">Двоетапна перевірка</Heading.H3>
            <DefinitionListView
              labels={{
                phone: "Номер телефону"
              }}
              data={{
                phone: (
                  <Link
                    href={`${REACT_APP_UPDATE_FACTOR}/?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                    size="s"
                    upperCase
                    color="black"
                    icon={<PencilIcon height="14" />}
                  >
                    {factor}
                  </Link>
                )
              }}
            />
          </Section>
        </>
      );
    }}
  </Query>
);

export default SecurityPage;
