import React from "react";
import system from "@ehealth/system-components";

const SearchIcon = props => (
  <svg {...props} fill="currentColor" viewBox="0 0 14 14">
    <path d="M9.222 3.033a4.376 4.376 0 1 0-6.19 6.19 4.376 4.376 0 1 0 6.19-6.19m4.552 10.741a.877.877 0 0 1-1.239 0L9.78 11.017c-2.4 1.794-5.804 1.624-7.984-.557a6.126 6.126 0 0 1 0-8.665 6.126 6.126 0 0 1 8.665 0c2.181 2.18 2.351 5.584.557 7.984l2.757 2.757a.876.876 0 0 1 0 1.238" />
  </svg>
);

export default system(
  { extend: SearchIcon, width: "14px", height: "14px" },
  "width",
  "height",
  "color"
);
