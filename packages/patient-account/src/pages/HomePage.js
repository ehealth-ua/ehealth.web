import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { ifProp } from "styled-tools";
import { Title, Link, CabinetTable, Switch } from "@ehealth/components";
import { ArrowRight } from "@ehealth/icons";

import DeclarationItem from "../components/DeclarationItem";
import Tabs from "../components/Tabs";

import DeclarationRequestsQuery from "../graphql/DeclarationRequestsQuery.graphql";
import DeclarationsQuery from "../graphql/DeclarationsQuery.graphql";
import NoDeclarationList from "../components/NoDeclarationList";
import DeclarationHistory from "../components/DeclarationHistory";

import { ArrowRightIcon } from "@ehealth/icons";
import Line from "../components/Line";

import { Route } from "react-router-dom";

const HomePage = props => (
  <>
    <Title.H1>особистий кабінет</Title.H1>
    <Tabs>
      {[
        {
          title: "Моя декларація",
          content: (
            <Query query={DeclarationsQuery}>
              {({ loading, error, data }) => {
                if (loading) return null;

                const { match } = props;
                const {
                  declarations: { data: [declaration] },
                  declarationRequests: { data: [declarationRequest] },
                  declarationHistory: { data: [...declarationHistory] }
                } = data;
                return (
                  <>
                    {declaration || declarationRequest ? (
                      <>
                        {declaration && (
                          <>
                            <DeclarationItem
                              declaration={declaration}
                              onReject={true}
                            />
                            <Line />
                          </>
                        )}
                        {declarationRequest && (
                          <>
                            <RequestTitle>Запит на декларацію</RequestTitle>
                            <DeclarationItem
                              declaration={declarationRequest}
                              blur={true}
                              type="declarationRequest"
                            />
                          </>
                        )}

                        {declarationHistory && (
                          <>
                            <ShowBlock>
                              <Link
                                to={match.url === "/" ? "/declarations" : "/"}
                                upperCase
                                bold
                                center
                              >
                                {match.url === "/"
                                  ? "Показати історію декларацій"
                                  : "Cховати історію декларацій"}
                              </Link>
                            </ShowBlock>
                            <Route
                              path="/declarations"
                              render={props => {
                                return (
                                  <DeclarationHistory
                                    {...props}
                                    data={declarationHistory}
                                  />
                                );
                              }}
                            />
                          </>
                        )}
                        <Line />
                        <Link
                          to="/search"
                          size="small"
                          upperCase
                          spaced
                          bold
                          icon={<ArrowRightIcon height="15px" fill="#2292f2" />}
                        >
                          Пошук лікаря
                        </Link>

                        <ShowBlock center>
                          <Link
                            to={match.url === "/" ? "/declarations" : "/"}
                            upperCase
                            bold
                            center
                          >
                            {match.url === "/"
                              ? "Показати історію декларацій"
                              : "Cховати історію декларацій"}
                          </Link>
                        </ShowBlock>
                        <Route
                          path="/declarations"
                          render={props => {
                            return (
                              <DeclarationHistory
                                {...props}
                                data={declarationHistory}
                              />
                            );
                          }}
                        />
                        <ShowBlock>
                          <Link
                            to="/search"
                            size="small"
                            upperCase
                            spaced
                            bold
                            icon={
                              <ArrowRightIcon height="15px" fill="#2292f2" />
                            }
                          >
                            Пошук лікаря
                          </Link>
                        </ShowBlock>
                      </>
                    ) : (
                      <NoDeclarationList />
                    )}
                  </>
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

const ShowBlock = styled.div`
  text-align: ${ifProp("center", "center")};
  margin: 45px 0;
`;

const RequestTitle = styled.h3`
  color: #000;
  margin: 0 0 25px 0;
  font-weight: 600;
  font-size: 16px;
`;
