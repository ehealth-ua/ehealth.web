import React from "react";
import system from "system-components/emotion";
import { variant } from "styled-system";
import styled from "react-emotion/macro";

const buttonStyle = variant({
  key: "buttonStyles"
});

const WrappedButton = styled.button`
  ${buttonStyle};
`;
const Button = system(
  {
    is: WrappedButton
  },
  `
  font-size: 14px;
  border-width: 1px;
  display: inline-block;
  vertical-align: middle;
  border-style: solid;
  padding: 5px 20px;
  outline: none;
  line-height: 1;
`
);

Button.defaultProps = {
  variant: "light"
};

export default Button;
