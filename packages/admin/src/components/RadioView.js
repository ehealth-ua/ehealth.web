import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

export const Circle = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 14px;
  margin-right: 14px;
  background-color: ${ifProp("disabled", "#E9EDF1", "#fff")};
  background-image: ${ifProp(
    "selected",
    "linear-gradient(0deg, #29B311 0%, #57D841 100%)"
  )};
  background-image: ${ifProp("disabled", "none")};
  border-width: 1px;
  border-style: solid;
  border-color: ${ifProp("selected", "#27aa11", "#c9c9c9")};
  border-color: ${ifProp("disabled", "#DFE3E9")};
  border-radius: 100%;
  text-align: center;

  &:before {
    content: "";
    vertical-align: middle;
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: ${ifProp("disabled", "#8f96a1", "#fff")};
    border-radius: 100%;
    opacity: ${ifProp("selected", 1, 0)};
  }
`;

export const Label = styled.label`
  color: ${ifProp("disabled", "#9299a3")};
  cursor: pointer;
  user-select: none;

  input {
    display: none;
  }
`;
