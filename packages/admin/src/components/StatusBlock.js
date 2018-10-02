import React, { Component } from "react";
import system from "system-components/emotion";
import statuses from "../helpers/statuses";
import { variant } from "@ehealth/system-tools";
import Badge from "./Badge";

const StatusBlock = ({ name, type, ...props }) => (
  <Item status={name} {...props}>
    {statuses[type][name]}
  </Item>
);

export const Item = system(
  {
    is: Badge,
    bg: "darkPastelGreen",
    p: 1,
    overflow: "hidden",
    borderRadius: 1,
    color: "white",
    textAlign: "center",
    minWidth: 20
  },
  {
    textOverflow: "ellipsis"
  },
  variant({
    prop: "status",
    key: "status.bg.states"
  })
);

export default StatusBlock;
