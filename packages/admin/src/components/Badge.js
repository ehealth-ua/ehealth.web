import React from "react";
import system from "system-components/emotion";
import statuses from "../helpers/statuses";
import { variant } from "@ehealth/system-tools";

const Badge = ({ name, type, ...props }) => (
  <Item status={name} title={statuses[type][name]} {...props}>
    {statuses[type][name]}
  </Item>
);

export const Item = system(
  {
    bg: "darkPastelGreen",
    display: "inline-block",
    p: 1,
    overflow: "hidden",
    borderRadius: 2,
    color: "white",
    textAlign: "center",
    minWidth: 20,
    minHeight: 20,
    fontSize: 10,
    lineHeight: 1
  },
  {
    textOverflow: "ellipsis",
    textTransform: "uppercase",
    verticalAlign: "middle"
  },
  variant({
    prop: "status",
    key: "status.bg.states"
  })
);

export default Badge;
