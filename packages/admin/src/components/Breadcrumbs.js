import React from "react";
import { Link } from "react-router-dom";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import { Match } from "@ehealth/components";

const Item = ({ to, ...props }) => (
  <Match path={to} exact>
    {({ to, active }) => (
      <Breadcrumb active={active}>
        <Link to={to} {...props} />
      </Breadcrumb>
    )}
  </Match>
);

const List = styled.ul`
  display: flex;
  flex-flow: row wrap;
  padding: 0;
  list-style: none;
`;

const Breadcrumb = styled.li`
  font-size: 14px;
  font-weight: 200;
  color: #354052;
  white-space: nowrap;
  margin-bottom: 10px;
  &:not(:last-of-type)::after {
    content: "";
    display: inline-block;
    width: 5px;
    height: 5px;
    border-right: 1px solid #848c98;
    border-top: 1px solid #848c98;
    transform: rotate(45deg);
    margin: 0 10px;
    vertical-align: middle;
  }
  a {
    text-decoration: none;
    color: ${ifProp("active", "#354052", "#848c98")};
    pointer-events: ${ifProp("active", "none")};
  }
`;

const Breadcrumbs = { List, Item };
export default Breadcrumbs;
