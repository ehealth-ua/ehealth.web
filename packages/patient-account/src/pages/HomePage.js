import React from "react";
import { Query } from "react-apollo";
import { ifProp } from "styled-tools";
import { Route } from "react-router-dom";
import styled from "react-emotion/macro";
import { ArrowRightIcon } from "@ehealth/icons";
import {
  Heading,
  Link,
  Pagination,
  SearchParams,
  Spinner
} from "@ehealth/components";

import DeclarationsQuery from "../graphql/DeclarationsQuery.graphql";
import NoDeclarationList from "../components/NoDeclarationList";
import DeclarationHistory from "../components/DeclarationHistory";
import Tabs from "../components/Tabs";
import DeclarationItem from "../components/DeclarationItem";
import Line from "../components/Line";

const HomePage = ({ match }) => (
  <>
    <Heading.H1>Особистий кабінет</Heading.H1>
    <Tabs>
      {[
        {
          title: "Моя декларація",
          content: (
            <SearchParams>
              {({ searchParams: { page = "1", pageSize = "10" } }) => (
                <Query query={DeclarationsQuery} variables={{ page, pageSize }}>
                  {({ loading, error, data, refetch }) => {
                    if (loading || error) return <Spinner />;

                    const {
                      declarations: {
                        data: [declaration]
                      },
                      declarationRequests: {
                        data: [declarationRequest]
                      },
                      declarationHistory: {
                        data: [...declarationHistory],
                        paging: historyPaging
                      }
                    } = data;
                    return (
                      <>
                        {declaration || declarationRequest ? (
                          <>
                            {declaration && (
                              <>
                                <DeclarationItem
                                  declaration={declaration}
                                  onReject={refetch}
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
                            <ShowBlock>
                              <Link
                                to="/search"
                                size="small"
                                upperCase
                                spaced
                                bold
                                icon={
                                  <ArrowRightIcon
                                    height="15px"
                                    fill="#2292f2"
                                  />
                                }
                              >
                                Пошук лікаря
                              </Link>
                            </ShowBlock>
                          </>
                        ) : (
                          <NoDeclarationList />
                        )}
                        {declarationHistory && (
                          <>
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
                                  <>
                                    <DeclarationHistory
                                      {...props}
                                      data={declarationHistory}
                                    />
                                    <Pagination
                                      totalPages={historyPaging.totalPages}
                                    />
                                  </>
                                );
                              }}
                            />
                          </>
                        )}
                      </>
                    );
                  }}
                </Query>
              )}
            </SearchParams>
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
