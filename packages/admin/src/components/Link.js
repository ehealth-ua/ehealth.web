import React from "react";
import * as Reach from "@reach/router";
import system from "system-components/emotion";

const Link = system(
  {
    is: Reach.Link,
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 0,
    color: "rockmanBlue"
  },
  `
    user-select: none;
    outline: none;
    text-decoration: none;
    cursor: pointer;
  `
);

export default Link;
