import styled from "@emotion/styled";
import { css } from "@emotion/core";

const iconDirection = props =>
  props.direction === "forward"
    ? css`
        border-width: 6px 0 6px 10.4px;
        border-color: transparent transparent transparent #ced0da;
      `
    : css`
        border-width: 6px 10.4px 6px 0;
        border-color: transparent #ced0da transparent transparent;
      `;

const Button = styled.button`
  background: none;
  border: 0 none;
  &:after {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    ${iconDirection};
    content: "";
  }
  &:focus {
    outline: none;
  }
`;

export default Button;
