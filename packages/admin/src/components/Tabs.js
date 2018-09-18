import React from "react";
import { Link, Match } from "@reach/router";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

/**
 * @example
 *
 * ```jsx
 * import Tabs from "../../components/Tabs";

 * <Tabs.Nav>
 *   <Tabs.NavItem to="./">Особиста інформація</Tabs.NavItem>
 *   <Tabs.NavItem to="auth">Метод аутентифікації</Tabs.NavItem>
 *   <Tabs.NavItem to="declarations">Декларації</Tabs.NavItem>
 * </Tabs.Nav>
 * <Tabs.Content>
 *   <Router>
 *     <UserInfo path="./" />
 *     <AuthInfo path="auth" />
 *     <DeclarationsInfo path="declarations" />
 *   </Router>
 * </Tabs.Content>
*/

const NavItem = ({ to, ...props }) => (
  <Match path={to}>
    {({ match }) => (
      <TabItem active={match}>
        <NavLink to={to} {...props} />
      </TabItem>
    )}
  </Match>
);

const Nav = styled.ul`
  display: flex;
  flex-flow: row wrap;
  list-style: none;
  padding: 20px 20px 0;
  margin-bottom: 0;
  background-color: #fafbfc;
  border: 1px solid #dfe2e5;
  font-size: 14px;
`;

const TabItem = styled.li`
  margin-bottom: -1px;
  background-color: ${ifProp("active", "#fff")};
  border: 1px solid ${ifProp("active", "#dfe2e5", "transparent")};
  border-bottom: 0;
  white-space: nowrap;
  cursor: pointer;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 16px 22px;
  color: #354052;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 10px;
  border-width: 0 1px 0 1px;
  border-color: #dfe2e5;
  border-style: solid;
  &:last-child {
    border-width: 0 1px 1px 1px;
  }
`;

const Tabs = { Nav, NavItem, Content };

export default Tabs;
