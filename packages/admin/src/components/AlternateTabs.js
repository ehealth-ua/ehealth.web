import React from "react";
import * as ReachRouter from "@reach/router";
import system from "system-components/emotion";
import { gradient, boolean } from "@ehealth/system-tools";

export const Nav = system(
  {
    is: "nav",
    mb: 4,
    repeatingLinearGradient: [
      [
        "transparent",
        ["transparent", 59],
        ["januaryDawn", 59],
        ["januaryDawn", 60]
      ]
    ]
  },
  gradient,
  {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: ["center", "space-around"]
  }
);

export const Item = system(
  {
    borderBottom: 3,
    borderColor: "transparent",
    color: "blueberrySoda",
    fontSize: 2,
    mx: [1, 2],
    height: 60
  },
  {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textDecoration: "none",
    whiteSpace: "nowrap"
  },
  boolean({
    prop: "active",
    borderColor: "rockmanBlue",
    color: "darkAndStormy"
  })
);

export const Link = props => (
  <ReachRouter.Match path={props.to}>
    {({ match }) => <Item is={ReachRouter.Link} {...props} active={!!match} />}
  </ReachRouter.Match>
);
