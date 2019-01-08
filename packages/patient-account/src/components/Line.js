import styled from "@emotion/styled";
import { ifProp, prop } from "styled-tools";

const Line = styled.hr`
  display: inline-block;
  margin: 20px 0;
  padding: 0;
  width: ${ifProp("width", `${prop("width")}px`, "100%")};
  height: 1px;
  border: none;
  background-color: #dedede;
`;

export default Line;
