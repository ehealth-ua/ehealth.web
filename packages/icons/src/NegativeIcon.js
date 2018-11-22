import React from "react";

const NegativeIcon = ({ fill = "none", stroke = "#1BB934", ...props }) => (
  <svg {...props} width="16" height="16">
    <path
      fill={fill}
      stroke={stroke}
      d="M8 .5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z"
    />
  </svg>
);

export default NegativeIcon;
