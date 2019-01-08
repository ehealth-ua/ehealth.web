import React from "react";
import styled from "@emotion/styled";

const CircleIcon = ({
  fill,
  stroke = "#c9f032",
  strokeWidth = "5",
  ...rest
}) => (
  <Svg viewBox="0 0 30 30" {...rest}>
    <circle
      cx="15"
      cy="15"
      r="15"
      style={{
        stroke,
        strokeWidth,
        fill: fill || "none",
        verticalAlign: "middle",
        ...rest
      }}
    />
  </Svg>
);

const Svg = styled.svg`
  padding: 1px;
  vertical-align: middle;
  width: 15px;
  height: 15px;
`;

export default CircleIcon;
