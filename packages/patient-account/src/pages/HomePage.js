import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { Title, Link, CabinetTable, Switch } from "@ehealth/components";
import { ArrowRight } from "@ehealth/icons";

import Tabs from "../components/Tabs";
import PatientDeclarations from "../components/PatientDeclarations";
import NoDeclarationList from "../components/NoDeclarationList";

const DeclarationQuery = gql`
  query {
    declarations
      @rest(path: "/cabinet/declarations", type: "DeclarationsPayload") {
      data
    }
  }
`;

const HomePage = props => (
  <>
    <Title.H1>особистий кабінет</Title.H1>
    <Tabs>
      {[
        {
          title: "Моя декларація",
          content: (
            <Query query={DeclarationQuery}>
              {({ loading, error, data = [] }) => {
                if (!loading && error && !data.declarations)
                  return <NoDeclarationList />;
                return (
                  !loading && (
                    <PatientDeclarations
                      data={data.declarations.data}
                      {...props}
                    />
                  )
                );
              }}
            </Query>
          )
        },
        { title: "Мої рецепти", content: "Сторінка в процесі розробки" }
      ]}
    </Tabs>
  </>
);
export default HomePage;
