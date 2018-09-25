import React from "react";
import { Link } from "@reach/router";
import { EhealthLogoIcon } from "@ehealth/icons";
import system from "system-components/emotion";
import { gradient } from "@ehealth/system-tools";

import Nav from "./Nav";

const Layout = ({ children }) => (
  <Wrapper>
    <Sidebar>
      <Link to="/">
        <Icon />
      </Link>
      <Nav />
    </Sidebar>
    <Content>{children}</Content>
  </Wrapper>
);

export default Layout;

const Wrapper = system(
  {
    is: "main",
    display: "flex",
    boxShadow: "0 0 15px 0 rgba(0,0,0,0.31)",
    m: 4,
    minHeight: "calc(100vh - 40px)"
  },
  {
    flexGrow: 1
  }
);

const Sidebar = system(
  {
    is: "aside",
    flexBasis: 220,
    px: 5,
    py: 6,
    linearGradient: [["-45deg", "enchantedBlue", "darkMidnightBlue"]]
  },
  {
    flexShrink: 0
  },
  gradient
);

const Icon = system({
  is: EhealthLogoIcon,
  ml: 4,
  width: 75
});

const Content = system({
  is: "section",
  bg: "white",
  display: "flex",
  flexDirection: "column",
  p: 2,
  overflow: "hidden",
  width: "100%"
});
