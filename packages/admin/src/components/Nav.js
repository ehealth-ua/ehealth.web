import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { BooleanValue } from "react-values";
import { Match, Link } from "@ehealth/components";
import { ChevronBottomIcon } from "@ehealth/icons";

import Ability from "./Ability";

const Nav = () => (
  <NavContainer>
    <NavList>
      <Ability loose action="read" resources={["contract", "contract_request"]}>
        <NavSection title="Контракти">
          <Ability action="read" resource="contract">
            <NavLink to="/contracts">Перелік контрактів</NavLink>
          </Ability>
          <Ability action="read" resource="contract_request">
            <NavLink to="/contract_requests">
              Запити на укладення контрактів
            </NavLink>
          </Ability>
        </NavSection>
      </Ability>
    </NavList>
  </NavContainer>
);

export default Nav;

const NavLink = ({ to, children, ...props }) => (
  <Match path={to} {...props}>
    {({ active, ...props }) => (
      <NavItem active={active}>
        <Link color="white" {...props}>
          {children}
        </Link>
      </NavItem>
    )}
  </Match>
);

const NavSection = ({ title, children }) => (
  <NavItem>
    <BooleanValue>
      {({ value: expanded, toggle }) => (
        <>
          <Link
            color="white"
            onClick={toggle}
            icon={<ChevronIcon open={expanded} />}
          >
            {title}
          </Link>

          {expanded && <NavList>{children}</NavList>}
        </>
      )}
    </BooleanValue>
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
  font-size: 12px;
  font-weight: ${ifProp("active", "700", "400")};
  line-height: 16px;
  list-style-image: radial-gradient(
    circle closest-side,
    ${ifProp("active", "#ff7800", "#fff")},
    ${ifProp("active", "#ff7800", "#fff")} 90%,
    transparent 100%
  );
  margin-top: 15px;
`;

const ChevronIcon = styled(ChevronBottomIcon)(
  ifProp("open", { transform: "rotate(180deg)" })
);
