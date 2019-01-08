import React from "react";
import { Query } from "react-apollo";
import { ifProp } from "styled-tools";
import { Router, Match } from "@reach/router";
import styled from "@emotion/styled";
import { loader } from "graphql.macro";
import { ArrowRightIcon } from "@ehealth/icons";
import {
  Heading,
  Link,
  Tabs,
  Pagination,
  LocationParams,
  Spinner
} from "@ehealth/components";

import NoDeclarationList from "../components/NoDeclarationList";
import DeclarationHistory from "../components/DeclarationHistory";
import DeclarationItem from "../components/DeclarationItem";
import Line from "../components/Line";

const DeclarationsQuery = loader("../graphql/DeclarationsQuery.graphql");

const HomePage = () => (
  <div data-test="home">
    <Heading.H1>Особистий кабінет</Heading.H1>
    <Tabs.Nav>
      <Tabs.Link to="./">Моя декларація</Tabs.Link>
      <Tabs.Link to="/recipe">Мої рецепти</Tabs.Link>
    </Tabs.Nav>
    <Router>
      <Declarations path="/*" />
      <Recipe path="/recipe" />
    </Router>
  </div>
);

export default HomePage;

const Declarations = () => (
  <LocationParams>
    {({ locationParams: { page = "1", pageSize = "10" } }) => (
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
                      dataTest="searchLink"
                      upperCase
                      spaced
                      bold
                      icon={<ArrowRightIcon height="15px" fill="#2292f2" />}
                    >
                      Пошук лікаря
                    </Link>
                  </ShowBlock>
                </>
              ) : (
                <NoDeclarationList />
              )}
              {!!declarationHistory.length && (
                <>
                  <ShowBlock center>
                    <Match path="/">
                      {({ match }) => (
                        <Link
                          to={match ? "/declarations" : "/"}
                          upperCase
                          bold
                          center
                        >
                          {match
                            ? "Показати історію декларацій"
                            : "Cховати історію декларацій"}
                        </Link>
                      )}
                    </Match>
                  </ShowBlock>
                  <Router>
                    <History
                      path="/declarations"
                      declarationHistory={declarationHistory}
                      totalPages={historyPaging.totalPages}
                    />
                  </Router>
                </>
              )}
            </>
          );
        }}
      </Query>
    )}
  </LocationParams>
);

const Recipe = () => "Сторінка в процесі розробки";

const History = ({ declarationHistory, totalPages, ...props }) => (
  <>
    <DeclarationHistory {...props} data={declarationHistory} />
    <Pagination totalPages={totalPages} />
  </>
);

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
