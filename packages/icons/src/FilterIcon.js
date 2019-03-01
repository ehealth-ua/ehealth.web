import React from "react";
import system from "@ehealth/system-components";

const FilterIcon = props => (
  <svg {...props} fill="currentColor">
    <path
      fill="currentColor"
      d="M9.6,1.3V0.1h-2v1.2C6.7,1.7,6.1,2.6,6.1,3.6s0.6,1.9,1.5,2.3v10.2h2V5.9c0.9-0.4,1.5-1.3,1.5-2.3 S10.5,1.7,9.6,1.3z M9.6,4.7C9.5,4.8,9.3,4.9,9.2,5c0,0,0,0,0,0C9,5.1,8.8,5.1,8.6,5.1S8.3,5.1,8.1,5c0,0,0,0,0,0 C7.9,4.9,7.8,4.8,7.6,4.7C7.3,4.4,7.1,4,7.1,3.6s0.2-0.8,0.5-1.1c0.1-0.1,0.3-0.2,0.5-0.3c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.1 s0.4,0,0.5,0.1c0,0,0,0,0,0c0.2,0.1,0.3,0.2,0.5,0.3c0.3,0.3,0.5,0.7,0.5,1.1S9.9,4.4,9.6,4.7z"
    />
    <path
      fill="currentColor"
      d="M3.6,8.3V0.1h-2v8.2c-0.9,0.4-1.5,1.3-1.5,2.3s0.6,1.9,1.5,2.3v3.2h2v-3.2c0.9-0.4,1.5-1.3,1.5-2.3 S4.5,8.7,3.6,8.3z M3.6,11.7c-0.1,0.1-0.3,0.2-0.5,0.3c0,0,0,0,0,0c-0.2,0.1-0.3,0.1-0.5,0.1s-0.4,0-0.5-0.1c0,0,0,0,0,0 c-0.2-0.1-0.3-0.2-0.5-0.3c-0.3-0.3-0.5-0.7-0.5-1.1s0.2-0.8,0.5-1.1c0.1-0.1,0.3-0.2,0.5-0.3c0,0,0,0,0,0 c0.2-0.1,0.3-0.1,0.5-0.1s0.4,0,0.5,0.1c0,0,0,0,0,0c0.2,0.1,0.3,0.2,0.5,0.3c0.3,0.3,0.5,0.7,0.5,1.1S3.9,11.4,3.6,11.7z"
    />
    <path
      fill="currentColor"
      d="M15.6,8.3V0.1h-2v8.2c-0.9,0.4-1.5,1.3-1.5,2.3s0.6,1.9,1.5,2.3v3.2h2v-3.2c0.9-0.4,1.5-1.3,1.5-2.3 S16.5,8.7,15.6,8.3z M15.6,11.7c-0.1,0.1-0.3,0.2-0.5,0.3c0,0,0,0,0,0c-0.2,0.1-0.3,0.1-0.5,0.1s-0.4,0-0.5-0.1c0,0,0,0,0,0 c-0.2-0.1-0.3-0.2-0.5-0.3c-0.3-0.3-0.5-0.7-0.5-1.1s0.2-0.8,0.5-1.1c0.1-0.1,0.3-0.2,0.5-0.3c0,0,0,0,0,0 c0.2-0.1,0.3-0.1,0.5-0.1s0.4,0,0.5,0.1c0,0,0,0,0,0c0.2,0.1,0.3,0.2,0.5,0.3c0.3,0.3,0.5,0.7,0.5,1.1S15.9,11.4,15.6,11.7z"
    />
  </svg>
);
export default system(
  { extend: FilterIcon, width: "16px", height: "16px" },
  "width",
  "height",
  "color"
);
