import React from "react";
import { Link } from "@reach/router";
import {
  EhealthLogoIcon,
  LogoutIcon as Logout,
  DocIcon as Doc
} from "@ehealth/icons";
import system from "system-components/emotion";
import { gradient } from "@ehealth/system-tools";
import { Box } from "rebass/emotion";

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
    linearGradient: [["-45deg", "enchantedBlue", "darkMidnightBlue"]]
  },
  {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column"
  },
  gradient
);

const LogoIcon = system({
  is: EhealthLogoIcon,
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

const BottomWrapper = system(
  {
    is: "div",
    mt: "auto",
    px: 6,
    py: 4
  },
  {
    borderTop: "1px solid #0083a1"
  }
);

const BottomLink = system(
  {
    is: "a",
    display: "block",
    py: 3,
    color: "white",
    fontSize: 0
  },
  {
    textDecoration: "none"
  }
);

const DocIcon = system({
  is: Doc,
  mr: 2
});

const LogoutIcon = system({
  is: Logout,
  mr: 2
});
