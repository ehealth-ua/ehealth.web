import React from "react";

const CheckMarkIcon = ({ fill = "#fff", ...props }) => (
  <svg width="11" height="9" viewBox="0 0 11 9" {...props}>
    <path
      fill={fill}
      fillRule="evenodd"
      d="M10.322 1.707l-6.07 6.071a.999.999 0 0 1-1.414 0L.3 5.243a1 1 0 0 1 1.414-1.415l1.83 1.83L8.909.292a.999.999 0 1 1 1.413 1.414"
    />
  </svg>
);

export default CheckMarkIcon;
