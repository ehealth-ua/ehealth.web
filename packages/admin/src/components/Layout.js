import React from "react";
import { Link } from "@reach/router";
import {
  EhealthLogoIcon,
  LogoutIcon as Logout,
  DocIcon as Doc
} from "@ehealth/icons";
import system from "@ehealth/system-components";
import { gradient } from "@ehealth/system-tools";
import { Box } from "@rebass/emotion";

import Nav from "./Nav";

const Layout = ({ children }) => (
  <Wrapper>
    <Sidebar>
      <Link to="/">
        <Box pt={6} pl={6} pr={5} ml={2}>
          <LogoIcon />
        </Box>
      </Link>
      <Box px={5}>
        <Nav />
      </Box>
      <BottomWrapper>
        <BottomLink
          href="http://docs.uaehealthapi.apiary.io/#"
          rel="noopener noreferrer"
          target="_blank"
        >
          <DocIcon />
          Документація
        </BottomLink>
        <BottomLink href="/auth/logout">
          <LogoutIcon width={10} height={10} />
          Вийти
        </BottomLink>
      </BottomWrapper>
    </Sidebar>
    <Content>{children}</Content>
  </Wrapper>
);

export default Layout;

const Wrapper = system(
  {
    is: "main",
    m: 4
  },
  {
    display: "flex",
    flexGrow: 1,
    boxShadow: "0 0 15px 0 rgba(0,0,0,0.31)",
    minHeight: "calc(100vh - 40px)"
  },
  "space"
);

const Sidebar = system(
  {
    is: "aside",
    linearGradient: [["-45deg", "enchantedBlue", "darkMidnightBlue"]],
    blacklist: ["linearGradient"]
  },
  {
    flexBasis: 220,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column"
  },
  gradient,
  "color"
);

const LogoIcon = system(
  {
    extend: EhealthLogoIcon,
    width: 75
  },
  "width"
);

const Content = system(
  {
    is: "section",
    bg: "white",
    p: 2
  },
  {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "100%"
  },
  "space",
  "color"
);

const BottomWrapper = system(
  {
    mt: "auto",
    px: 6,
    py: 4
  },
  {
    borderTop: "1px solid #0083a1"
  },
  "space"
);

const BottomLink = system(
  {
    is: "a",
    py: 3,
    color: "white",
    fontSize: 0
  },
  {
    display: "block",
    textDecoration: "none"
  },
  "space",
  "color",
  "fontSize"
);

const DocIcon = system(
  {
    extend: Doc,
    mr: 2
  },
  "space"
);

const LogoutIcon = system(
  {
    extend: Logout,
    mr: 2
  },
  "space",
  "width",
  "height"
);
