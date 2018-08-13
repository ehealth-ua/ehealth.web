import React from "react";

const ThinAddIcon = ({ ...props }) => (
  <svg
    {...props}
    fill="currentColor"
    width="10"
    height="10"
    viewBox="0 0 10 10"
  >
    <path
      d="M66 162V160H76V162ZM70 166V156H72V166Z "
      transform="matrix(1,0,0,1,-66,-156)"
    />
  </svg>
);

export default ThinAddIcon;
