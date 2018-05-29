import React from "react";
<<<<<<< HEAD
import { Title, Link } from "@ehealth/components";
=======
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { Title, Link, CabinetTable, Switch } from "@ehealth/components";
>>>>>>> feat(patient-account): add HomePage
import { ArrowRight } from "@ehealth/icons";

import Tabs from "../components/Tabs";

import PatientDeclarations from "../blocks/PatientDeclarations";
import NoDeclarationList from "../blocks/NoDeclarationList";

const DeclarationQuery = gql`
  query {
    declarations
      @rest(path: "/cabinet/declarations", type: "DeclarationsPayload") {
      data
    }
  }
`;

const HomePage = () => (
  <>
    <Title.H1>особистий кабінет</Title.H1>
    <Tabs>
      {[
        {
          title: "Моя декларація",
          content: (
<<<<<<< HEAD
            <>
              <p>
                Декларація відсутня. Для підписання декларації, виконайте
                наступні кроки
              </p>
              <OrderedList>
                {[
                  "Оберіть лікаря",
                  "Створіть запит на декларацію",
                  "Очікуйте на підтвердження"
                ]}
              </OrderedList>
              <Line />

              <Link
                to="/search"
                size="small"
                upperCase
                spaced
                bold
                icon={<ArrowRight height="15px" fill="#2292f2" />}
              >
                крок 1. оберіть лікаря
              </Link>
            </>
=======
            <Query query={DeclarationQuery}>
              {({ loading, error, data = [] }) => {
                if (!data.declarations) return <NoDeclarationList />;
                return (
                  <>
                    <PatientDeclarations data={data.declarations.data} />
                  </>
                );
              }}
            </Query>
>>>>>>> feat(patient-account): add HomePage
          )
        },
        { title: "Мої рецепти", content: "Сторінка в процесі розробки" }
      ]}
    </Tabs>
  </>
);
export default HomePage;
