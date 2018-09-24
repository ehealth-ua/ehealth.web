import system from "system-components/emotion";
import * as Reach from "@reach/router";

const Link = system(
  {
    is: Reach.Link,
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 0,
    fontWeight: "normal",
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
