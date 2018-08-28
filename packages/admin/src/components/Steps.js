import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "react-emotion/macro";
import { ifProp, prop } from "styled-tools";

import { Match } from "@ehealth/components";

const Container = ({ children }) => (
  <List>
    {React.Children.map(children, (item, index) => {
      const { to, children } = item.props;
      const stepNumber = index + 1;
      return (
        <Match path={to} exact>
          {({ to, active }) =>
            React.cloneElement(item, {
              stepNumber,
              active,
              children: (
                <Link to={to}>
                  Крок {stepNumber}. {children}
                </Link>
              )
            })
          }
        </Match>
      );
    })}
  </List>
);

const List = styled.ul`
  display: flex;
  flex-flow: row no-wrap;
  max-width: 870px;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  font-size: 14px;
  margin-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: "${prop("stepNumber")}";
    color: ${ifProp("active", "#848c98", "#fff")};
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 26px;
    margin-right: 12px;
    text-align: center;
    border-radius: 50%;
    background-color: ${ifProp("active", "#fff", "#2ea1f8")};
    border: 1px solid ${ifProp("active", "#e6eaee", "#fff")};
  }
  a {
    color: ${ifProp("active", "#848c98", "#354052")};
    pointer-events: ${ifProp("active", "none")};
  }
`;

const Steps = { Container, Item };
export default Steps;
