import React from "react";
import system from "system-components/emotion";
import { Badge as RebassBadge } from "rebass/emotion";

const Badge = system(
  {
    is: RebassBadge,
    fontSize: 10,
    px: "5px",
    minWidth: 20,
    minHeight: 20
  },
  `
  text-transform: uppercase;
  padding-top: 6px;
  padding-bottom: 5px;
`
);

export default Badge;
