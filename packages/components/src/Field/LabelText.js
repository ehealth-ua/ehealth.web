import styled from "react-emotion/macro";
import { prop } from "styled-tools";

export const LabelText = styled.span`
  color: #3d3d3d;
  display: block;
  font-size: ${prop("theme.input.labelFontSize", 12)}px;
  margin-bottom: 10px;
  text-align: left;
`;

export default LabelText;
