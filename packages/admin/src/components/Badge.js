import React from "react";
import system from "@ehealth/system-components";
import statuses from "../helpers/statuses";
import { variant } from "@ehealth/system-tools";

const Badge = ({ name, type, ...props }) => (
  <Item variant={name} title={statuses[type][name]} {...props}>
    {statuses[type][name]}
  </Item>
);

export const Item = system(
  {
    display: "inline-block",
    p: 1,
    color: "white",
    minWidth: 20,
    minHeight: 20,
    fontSize: 10
  },
  {
    textOverflow: "ellipsis",
    textTransform: "uppercase",
    verticalAlign: "middle",
    borderRadius: 2,
    fontWeight: "bold",
    lineHeight: 1,
    textAlign: "center",
    overflow: "hidden"
  },
  variant({
    key: "status.bg.states"
  }),
  "minWidth",
  "minHeight",
  "display",
  "color",
  "space",
  "fontSize"
);

export default Badge;
