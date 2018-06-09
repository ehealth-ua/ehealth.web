import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { ifProp, prop } from "styled-tools";
import styled from "react-emotion/macro";
import { Route } from "react-router-dom";
import { ArrowRightIcon } from "@ehealth/icons";
import { CabinetTable, Link } from "@ehealth/components";

import Line from "../components/Line";
import NoDeclarationList from "../components/NoDeclarationList";
import ActiveDeclaration from "../components/ActiveDeclaration";
import DeclarationHistory from "../components/DeclarationHistory";

const PatientDeclarations = ({ data, match }) => {
  const active = data.find(
    ({ status }) => status === "active" || status === "pending_verification"
  );
  return (
    <>
      {active ? <ActiveDeclaration active={active} /> : <NoDeclarationList />}
      {data.length && (
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
              return <DeclarationHistory {...props} data={data} />;
            }}
          />
        </>
      )}
      {active && (
        <ShowBlock>
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
        </ShowBlock>
      )}
    </>
  );
};

export default PatientDeclarations;

const ShowBlock = styled.div`
  text-align: ${ifProp("center", "center", "left")};
  margin: 45px 0;
`;
