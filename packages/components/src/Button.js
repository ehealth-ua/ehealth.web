import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, switchProp } from "styled-tools";

import RouterLink from "./RouterLink";

type Props = {
  /** Location */
  to: string,
  /** The button label */
  children: string,
  /** Set letterSpacing to 2.4px */
  letterSpacing?: boolean,
  /** Makes the button full width */
  block?: boolean,
  /** The scale to be used for the font size */
  sizes?: "xs" | "small" | "medium" | "large"
};

const Button = (props: Props) => {
  const Component = ButtonContainer.withComponent(
    props.href ? "a" : props.to ? RouterLink : "button"
  );

  return <Component {...props} />;
};

export default Button;

const ButtonContainer = styled.button`
  display: ${ifProp("block", "block", "inline-block")};
  background-color: #2292f2;
  background-image: linear-gradient(
    0deg,
    rgba(0, 134, 242, 0.67) 0%,
    rgba(74, 178, 251, 0.67) 100%
  );
  color: #fff;
  cursor: default;
  font-weight: 700;
  font-size: ${switchProp("size", {
    xs: prop("theme.button.sizes.xs", "10px"),
    small: prop("theme.button.sizes.small", "14px"),
    medium: prop("theme.button.sizes.medium", "18px"),
    large: prop("theme.button.sizes.large", "22px")
  })};
  letter-spacing: ${prop("theme.button.letterSpacing", 2.4)}px;
  width: ${ifProp("block", "100%")};
  padding: ${prop("theme.button.paddingVertical", 18)}px
    ${prop("theme.button.paddingHorizontal", 35)}px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  user-select: none;

  &:hover {
    background-image: linear-gradient(
      0deg,
      rgba(74, 178, 251, 0.67) 0%,
      rgba(74, 178, 251, 0.67) 100%
    );
  }

  &:active {
    background-image: none;
  }

  &:disabled {
    background-color: rgba(34, 146, 242, 0.5);
    background-image: linear-gradient(
      0deg,
      rgba(0, 134, 242, 0.34) 0%,
      rgba(74, 178, 251, 0.34) 100%
    );
  }
`;
