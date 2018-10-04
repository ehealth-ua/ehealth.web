import React from "react";

const MenuListIcon = ({ innerRef, ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
    ref={innerRef}
  >
    <path d="M0 14h16v2H0zM0 7h16v2H0zM0 0h16v2H0z" />
  </svg>
);

export default MenuListIcon;
