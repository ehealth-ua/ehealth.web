import React from "react";

const DefaultImageIcon = ({ innerRef, ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
    ref={innerRef}
  >
    <path d="M13.95 14.205H2.147c-.518 0-.749-.375-.515-.837l3.219-6.376c.233-.462.678-.504.992-.092l3.237 4.23a.793.793 0 0 0 1.23.078l.791-.802c.364-.369.9-.323 1.197.101l2.05 2.929c.297.425.118.769-.4.769zm-3.518-11.41a1.876 1.876 0 1 1 0 3.751 1.876 1.876 0 0 1 0-3.751zM0 16h16V0H0v16z" />
  </svg>
);

export default DefaultImageIcon;
