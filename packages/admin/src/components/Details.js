import React from "react";
import system from "@ehealth/system-components";
import { mixed } from "@ehealth/system-tools";
import { ChevronBottomIcon } from "@ehealth/icons";

const Details = ({ summary, children }) => (
  <details>
    <Summary>
      {summary}
      <Icon />
    </Summary>
    {children}
  </details>
);

export default Details;

const Summary = system(
  {
    is: "summary",
    display: "flex",
    alignItems: "center",
    color: "rockmanBlue",
    fontSize: 1,
    mb: 5
  },
  props => ({
    userSelect: "none",
    "&::-webkit-details-marker": mixed({
      borderTop: 1,
      borderColor: "januaryDawn",
      display: "block",
      flexGrow: 1,
      order: 9999,
      height: 0,
      ml: 3,
      mr: 0
    })(props)
  })
);

const Icon = system(
  {
    extend: ChevronBottomIcon,
    ml: 2,
    width: 11
  },
  {
    "details[open] &": {
      transform: "rotate(180deg)"
    }
  }
);
