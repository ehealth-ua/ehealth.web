import React from "react";

const MenuTileIcon = ({ innerRef, ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
    ref={innerRef}
  >
    <path d="M0 0h7v7H0zM9 0h7v7H9zM0 9h7v7H0zM9 9h7v7H9z" />
  </svg>
);

export default MenuTileIcon;
