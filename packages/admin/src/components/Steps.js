import React from "react";
import * as Reach from "@reach/router";
import system from "system-components/emotion";
import { mixed, boolean } from "@ehealth/system-tools";

export const Item = ({ to, ...props }) => (
  <Reach.Match path={to}>
    {({ match }) => <Link to={to} active={!!match} {...props} />}
  </Reach.Match>
);

const Link = system(
  {
    is: Reach.Link,
    display: "flex",
    overflow: "hidden",
    mr: 2,
    color: "darkAndStormy",
    fontSize: 2,
    alignItems: "center"
  },
  {
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
      color: active ? "romanSilver" : "white",
      display: "inline-block",
      minWidth: "28px",
      height: "28px",
      lineHeight: "27px",
      mr: 2,
      textAlign: "center",
      borderRadius: "50%",
      bg: active ? "white" : "freshBlueOfBelAir",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: active ? "callaLily" : "white"
    })(props)
  }),
  boolean({
    prop: "active",
    pointerEvents: "none",
    color: "romanSilver"
  })
);

const List = system(
  {
    is: "nav",
    display: "flex",
    mb: 4
  },
  `
    counter-reset: step;
  `
);

const Steps = { List, Item };
export default Steps;
