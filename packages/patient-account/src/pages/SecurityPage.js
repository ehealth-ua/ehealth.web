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
  REACT_APP_UPDATE_FACTOR_URL,
  REACT_APP_OAUTH_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "../env";

const SecurityPage = () => (
  <Query query={AuthenticationFactorQuery}>
    {({ loading, error, data }) => {
      if (loading || error || !data.factor) return null;
      const { factor: { data: factor } } = data;
      let isActive, phone;
      if (factor.length > 0) {
        [{ isActive, factor: phone }] = factor;
      }

      return (
        <>
          <Heading.H1>Безпека</Heading.H1>
          <Section>
            <Heading.H3 weight="bold">
              Двоетапна перевірка{" "}
              {(factor.length === 0 || !isActive) && "не встановлена"}
            </Heading.H3>
            {factor.length > 0 && isActive && phone ? (
              <DefinitionListView
                labels={{
                  phone: "Номер телефону"
                }}
                data={{
                  phone: (
                    <Link
                      href={`${REACT_APP_UPDATE_FACTOR_URL}/?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                      size="s"
                      upperCase
                      color={"black"}
                      icon={<PencilIcon height="14" />}
                    >
                      {phone}
                    </Link>
                  )
                }}
              />
            ) : (
              <p>
                На жаль, другий фактор авторизації був скинутий.<br />
                Для того, щоб його задати повторно необхідно ще раз пройти
                процес{" "}
                <Link
                  href={`${REACT_APP_OAUTH_URL}/?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                >
                  авторизації
                </Link>
              </p>
            )}
          </Section>
        </>
      );
    }}
  </Query>
);

export default SecurityPage;
