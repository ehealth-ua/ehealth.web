import React from "react";

const DropDownButton = props => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14z" />
    <path d="M7.172 10.976v-2.16H5V7.16h2.172V5h1.704v2.16h2.172v1.656H8.876v2.16z" />
  </svg>
);

export default DropDownButton;
