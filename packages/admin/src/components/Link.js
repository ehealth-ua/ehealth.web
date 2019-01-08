import system from "@ehealth/system-components";
import * as Reach from "@reach/router";

const Link = system(
  {
    is: Reach.Link,
    fontSize: 0,
    color: "rockmanBlue"
  },
  {
    display: "inline-block",
    verticalAlign: "middle",
    userSelect: "none",
    outline: "none",
    textDecoration: "none",
    cursor: "pointer"
  },

  "display",
  "verticalAlign",
  "color",
  "fontSize",
  "fontWeight"
);

export default Link;
