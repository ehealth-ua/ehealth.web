import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, switchProp } from "styled-tools";
import { NavLink as RouterLink } from "react-router-dom";
import { pickValidProps } from "@ehealth/utils";

const Link = props => {
  const { icon, to, rtl, letterIndent, bold, size, children } = props;
  const validProps = pickValidProps(props);
  const Component = LinkContainer.withComponent(to ? RouterLink : "a");
  return (
    <Wrapper rtl={rtl} bold={bold}>
      <Component
        {...validProps[0]}
        activeStyle={{
          fontWeight: "bold"
        }}
      >
        {children}
      </Component>
      {icon && (
        <Icon rtl={rtl} size={size}>
          {icon}
        </Icon>
      )}
    </Wrapper>
  );
};

Link.defaultProps = {
  color: "blue"
};

export default Link;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => props.rtl && "row-reverse"};
  line-height: 1;
  font-weight: ${props => props.bold && "bold"};
`;

const LinkContainer = styled.a`
  color: ${switchProp("color", {
    blue: "#2292f2",
    black: "#333"
  })};
  cursor: default;
  font-size: ${switchProp("size", {
    xs: "10px",
    small: "14px",
    medium: "18px",
    large: "22px"
  })};
  letter-spacing: ${props => props.letterIndent && "2.4px"};
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  user-select: none;
`;

const Icon = styled.span`
  padding-right: ${props => props.rtl && "7px"};
  padding-left: ${props => !props.rtl && "7px"};
  vertical-align: middle;
`;
