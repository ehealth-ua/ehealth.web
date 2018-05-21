import React from "react";

const RemoveIcon = ({ innerRef, ...props }) => (
  <svg {...props} ref={innerRef} width="28" height="28" viewBox="0 0 550 550">
    <circle r="256" fill="#fc4b4e" cy="272.381" cx="275" />
    <path
      fill="#FFF"
      d="M393.511 338.818l-62.508-62.508L393.51 213.8l-56.003-56.003L275 220.307l-62.508-62.509-56.003 56.003 62.508 62.509-62.508 62.508 56.003 56.003L275 332.312l62.508 62.509z"
    />
  </svg>
);

export default RemoveIcon;
