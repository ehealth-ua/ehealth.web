import React from "react";

const AddIcon = ({ innerRef, ...props }) => (
  <svg {...props} ref={innerRef} width="28" height="28" viewBox="0 0 550 550">
    <circle r="256" fill="#27cc6c" cy="273.69" cx="275" />
    <path
      fill="#FFF"
      d="M403 235.4h-88.4V147h-79.2v88.4H147v79.2h88.4V403h79.2v-88.4H403z"
    />
  </svg>
);

export default AddIcon;
