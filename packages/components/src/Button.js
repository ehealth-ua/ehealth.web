import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp } from "styled-tools";
import { Link } from "react-router";

const Button = props => {
  const Component = ButtonContainer.withComponent(
    props.href ? "a" : props.to ? Link : "button"
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
  font-weight: 700;
  font-size: ${prop("theme.button.fontSize", 12)}px;
  letter-spacing: ${prop("theme.button.letterSpacing", 2.4)}px;
  width: ${ifProp("block", "100%")};
  padding: ${prop("theme.button.paddingVertical", 18)}px
    ${prop("theme.button.paddingHorizontal", 35)}px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  user-select: none;
  cursor: pointer;

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
    background-image: linear-gradient(
      0deg,
      rgba(0, 134, 242, 0.67) 0%,
      rgba(74, 178, 251, 0.67) 100%
    );
  }
`;
