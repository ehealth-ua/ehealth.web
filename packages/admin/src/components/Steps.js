import React from "react";
import * as Reach from "@reach/router";
import system from "@ehealth/system-components";
import { mixed, boolean } from "@ehealth/system-tools";

export const Item = ({ to, disabled, ...props }) => (
  <Reach.Match path={to}>
    {({ match }) => (
      <Link
        to={to}
        active={!!match}
        is={disabled || !!match ? "div" : Reach.Link}
        {...props}
      />
    )}
  </Reach.Match>
);

const Link = system(
  {
    mr: 2,
    fontSize: 1,
    color: "romanSilver"
  },
  {
    display: "flex",
    overflow: "hidden",
    alignItems: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  ({ active, ...props }) => ({
    "&::before": mixed({
      counterIncrement: "step",
      content: '"Крок " counter(step) ". "',
      mr: 1
    })(props),
    "&::after": mixed({
      order: "-1",
      content: "counter(step)",
      color: active ? "white" : "romanSilver",
      display: "inline-block",
      minWidth: "28px",
      height: "28px",
      lineHeight: "27px",
      mr: 2,
      textAlign: "center",
      borderRadius: "50%",
      bg: active ? "rockmanBlue" : "white",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: active ? "white" : "callaLily"
    })(props)
  }),
  boolean({
    prop: "active",
    color: "darkAndStormy"
  }),
  "space",
  "color",
  "fontSize"
);

const List = system(
  {
    is: "nav",
    mb: 4
  },
  {
    display: "flex",
    counterReset: "step"
  },
  "space"
);

const Steps = { List, Item };
export default Steps;
