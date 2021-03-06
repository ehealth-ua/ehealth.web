import React from "react";
import * as Reach from "@reach/router";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { prop, ifProp, switchProp } from "styled-tools";
import { pickValidProps } from "@ehealth/utils";

const Link = props => {
  const [
    { children, size, ...linkProps },
    { icon, iconReverse, ...textProps }
  ] = pickValidProps(props);

  const Component = LinkContainer.withComponent(
    props.href ? "a" : props.to ? Reach.Link : "button"
  );

  const content = [
    <Text key="text" size={size} {...textProps}>
      {children}
    </Text>,
    icon && (
      <Icon key="icon" iconReverse={iconReverse}>
        {icon}
      </Icon>
    )
  ];
  return (
    <Component
      {...linkProps}
      type={!(props.href || props.to) ? "button" : undefined}
      data-test={props.dataTest}
    >
      {iconReverse ? content.reverse() : content}
    </Component>
  );
};

export default Link;

const LinkContainer = styled.a`
  color: ${switchProp(prop("color", "blue"), {
    red: prop("theme.link.colors.red", "#ff1751"),
    blue: prop("theme.link.colors.blue", "#2292f2"),
    black: prop("theme.link.colors.black", "#333"),
    white: prop("theme.link.colors.white", "#fff")
  })};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  opacity: ${ifProp("disabled", "0.5")};
  padding: 0;
  text-decoration: none;
`;

const Text = styled.span`
  font-size: ${switchProp("size", {
    xs: prop("theme.link.sizes.xs", "10px"),
    small: prop("theme.link.sizes.small", "14px"),
    medium: prop("theme.link.sizes.medium", "18px"),
    large: prop("theme.link.sizes.large", "22px")
  })};
  font-weight: ${ifProp("bold", "700")};
  letter-spacing: ${ifProp(
    "spaced",
    prop("theme.link.letterSpacing", "2.4px")
  )};
  text-transform: ${ifProp("upperCase", "uppercase")};
`;

const Icon = styled.span`
  display: flex;
  flex: 0 0 auto;

  ${ifProp(
    "iconReverse",
    css`
      margin-right: 7px;
    `,
    css`
      margin-left: 7px;
    `
  )};
`;
