import React from "react";
import styled from "react-emotion/macro";

const CircleIcon = ({
  fill = "none",
  stroke = "#c9f032",
  strokeWidth = "3",
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
        fill,
        verticalAlign: "middle",
        ...rest
      }}
    />
  </Svg>
);

const Svg = styled.svg`
  padding: 1px;
  vertical-align: middle;
  height: 15px;
`;

export default CircleIcon;
