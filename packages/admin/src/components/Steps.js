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
    color: "romanSilver",
    fontSize: 1,
    alignItems: "center"
  },
  {
    textDecoration: "none",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    pointerEvents: "visible"
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
    color: "darkAndStormy",
    pointerEvents: "none"
  })
);

const List = system(
  {
    is: "nav",
    display: "flex",
    mb: 4
  },
  {
    counterReset: "step"
  }
);

const Steps = { List, Item };
export default Steps;
