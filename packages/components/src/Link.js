import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, switchProp } from "styled-tools";
import { Link as RouterLink } from "react-router-dom";

const Link = ({ icon, to, children, ...rest }) => {
  const Component = LinkContainer.withComponent(to ? RouterLink : "a");

  return (
    <Wrapper>
      <Component {...rest}>{children}</Component>
      {icon && <Icon>{icon}</Icon>}
    </Wrapper>
  );
};

export default Link;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const LinkContainer = styled.a`
  display: ${ifProp("block", "block", "inline-block")};
  color: #2292f2;
  cursor: default;
  font-weight: 700;
  font-size: ${switchProp("size", {
    small: "14px",
    medium: "18px",
    large: "22px"
  })};
  letter-spacing: ${prop("theme.link.letterSpacing", 2.4)}px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  user-select: none;
`;

const Icon = styled.span`
  padding-left: 10px;
`;
