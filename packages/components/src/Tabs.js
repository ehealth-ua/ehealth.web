import React from "react";
import * as ReachRouter from "@reach/router";
import system from "@ehealth/system-components";
import { gradient, boolean } from "@ehealth/system-tools";

const Nav = system(
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
    ],
    blacklist: ["repeatingLinearGradient"]
  },
  {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: ["center", "space-around"]
  },
  gradient,
  "space",
  "justifyContent",
  "repeatingLinearGradient"
);

const Item = system(
  {
    fontSize: 2,
    mx: [4, 6],
    color: "blueberrySoda",
    blacklist: ["active"]
  },
  {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    height: 60,
    borderBottomWidth: 3,
    borderBottomStyle: "solid",
    borderColor: "transparent"
  },
  boolean({
    prop: "active",
    borderColor: "rockmanBlue",
    color: "darkAndStormy"
  }),
  "space",
  "color",
  "fontSize",
  "borderBottom",
  "borderColor"
);

const Link = props => (
  <ReachRouter.Match path={props.to}>
    {({ match }) => (
      <Item extend={ReachRouter.Link} {...props} active={!!match} />
    )}
  </ReachRouter.Match>
);

const Tabs = { Link, Item, Nav };

export default Tabs;
