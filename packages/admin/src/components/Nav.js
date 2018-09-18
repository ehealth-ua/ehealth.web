import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { Match } from "@reach/router";
import { ChevronBottomIcon } from "@ehealth/icons";

import Ability from "./Ability";
import Link from "./Link";

const Nav = () => (
  <NavContainer>
    <NavList>
      <Ability action="read" resource="person">
        <NavSection title="Паціенти">
          <NavLink to="/patients">Пошук паціентів</NavLink>
        </NavSection>
      </Ability>
    </NavList>
  </NavContainer>
);

export default Nav;

const NavLink = ({ to, children }) => (
  <Match path={`${to}/*`}>
    {({ match }) => (
      <NavItem isCurrent={match}>
        <Link
          to={to}
          color="white"
          fontWeight={match && "bold"}
          display="inline"
          verticalAlign="baseline"
        >
          {children}
        </Link>
      </NavItem>
    )}
  </Match>
);

const NavSection = ({ title, children }) => (
  <NavItem>
    <details>
      <Link
        is="summary"
        color="white"
        display="inline"
        verticalAlign="baseline"
      >
        {title}
        <ChevronIcon width="7" height="7" />
      </Link>
      <NavList>{children}</NavList>
    </details>
  </NavItem>
);

const NavContainer = styled.nav`
  margin-top: 80px;
`;

const NavList = styled.ul`
  margin: 25px 0 0;
  padding-left: 20px;
`;

const NavItem = styled.li`
  font-weight: ${ifProp("isCurrent", "700", "400")};
  line-height: 16px;
  list-style-image: radial-gradient(
    circle closest-side,
    ${ifProp("isCurrent", "#ff7800", "#fff")},
    ${ifProp("isCurrent", "#ff7800", "#fff")} 90%,
    transparent 100%
  );
  margin-top: 15px;
`;

const ChevronIcon = styled(ChevronBottomIcon)`
  margin-left: 10px;
  details[open] & {
    transform: rotate(180deg);
  }
`;
