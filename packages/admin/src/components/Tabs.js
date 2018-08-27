import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import { Match } from "@ehealth/components";

const NavItem = ({ to, ...props }) => (
  <Match path={to}>
    {({ to, active }) => (
      <TabItem active={active}>
        <Link to={to} {...props} />
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
  padding: 16px 22px;
  margin-bottom: -1px;
  background-color: ${ifProp("active", "#fff")};
  border: 1px solid ${ifProp("active", "#dfe2e5", "transparent")};
  border-width: 1px 1px 0 1px;
  white-space: nowrap;
  cursor: pointer;
`;

const Link = styled(RouterLink)`
  color: #354052;
  text-decoration: none;
`;

const Content = styled.div`
  border: 1px solid #dfe2e5;
  border-width: 0 1px 1px 1px;
  padding: 50px 42px;
`;

const Tabs = { Nav, NavItem, Content };
export default Tabs;
