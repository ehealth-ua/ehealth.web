import system from "system-components/emotion";

const Root = system(
  {
    fontFamily: "sans",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  "fontFamily",
  {
    "& *, & *::before, & *::after": {
      boxSizing: "border-box"
    }
  },
  "space",
  "color"
);

Root.displayName = "Root";

export default Root;
