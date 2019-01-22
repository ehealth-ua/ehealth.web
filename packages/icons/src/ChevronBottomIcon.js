import React from "react";
import system from "@ehealth/system-components";

const ChevronBottomIcon = props => (
  <svg {...props} viewBox="0 0 7 4">
    <path
      fill="currentColor"
      d="M3.536 2.657L6.012.18a.504.504 0 0 1 .706.002.494.494 0 0 1 .001.705L3.887 3.72a.504.504 0 0 1-.703 0L.352.887A.504.504 0 0 1 .354.182.494.494 0 0 1 1.059.18l2.477 2.477z"
    />
  </svg>
);

export default system(
  {
    extend: ChevronBottomIcon,
    color: "jacarandaLight",
    width: "7px",
    height: "4px"
  },
  "width",
  "height",
  "color",
  "space",
  "verticalAlign"
);
