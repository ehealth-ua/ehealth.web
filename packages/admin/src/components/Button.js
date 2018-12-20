import React from "react";
import { Box } from "rebass/emotion";
import system from "system-components/emotion";

export const IconButton = ({ children, icon: Icon, ...props }) => (
  <Container {...props}>
    <Icon />
    <Box ml="2">{children}</Box>
  </Container>
);

const Button = system(
  {
    is: "button",
    border: 1,
    fontSize: 1,
    lineHeight: 1,
    px: 4,
    py: 2,
    variant: "light"
  },
  `
    cursor: default;
    display: inline-block;
    vertical-align: middle;
    outline: none;
    text-decoration: none;
  `
);

const Container = system(
  {
    is: "button",
    display: "flex",
    alignItems: "center",
    color: "rockmanBlue",
    fontSize: 0,
    fontWeight: 700,
    lineHeight: 1.2,
    py: 2
  },
  {
    cursor: "pointer",
    whiteSpace: "nowrap"
  }
);

Button.displayName = "Button";

export default Button;
