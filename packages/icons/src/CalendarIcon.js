import React from "react";
import system from "@ehealth/system-components";

const CalendarIcon = props => (
  <svg {...props}>
    <path
      fill="currentColor"
      d="M4 9h2V7H4v2zm0 3h2v-2H4v2zm3-3h2V7H7v2zm0 3h2v-2H7v2zm3-3h2V7h-2v2zm0 3h2v-2h-2v2zm4-6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6zm0 10H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2v1a1 1 0 0 0 2 0V0h4v1a1 1 0 0 0 2 0V0h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"
    />
  </svg>
);

export default system(
  { extend: CalendarIcon, width: "16px", height: "16px", color: "silverCity" },
  "width",
  "height",
  "color"
);
