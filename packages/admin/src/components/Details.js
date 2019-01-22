import React from "react";
import system from "@ehealth/system-components";
import { mixed } from "@ehealth/system-tools";
import { ChevronBottomIcon as Icon } from "@ehealth/icons";

const Details = ({ summary, children }) => (
  <details>
    <Summary>
      {summary}
      <Icon
        width="11px"
        height="11px"
        ml={2}
        css={`
          details[open] & {
            transform: rotate(180deg);
        `}
      />
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
