import React from "react";
import system from "system-components/emotion";
import { RemoveItemIcon } from "@ehealth/icons";

export const ResetButton = ({ children, ...props }) => (
  <Container {...props}>
    <Reset />
    {children}
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
    display: inline-block;
    vertical-align: middle;
    outline: none;
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
    lineHeight: 1,
    py: 2
  },
  {
    cursor: "pointer",
    whiteSpace: "nowrap"
  }
);

const Reset = system({
  is: RemoveItemIcon,
  color: "rockmanBlue",
  minWidth: "8px",
  mr: 2
});

Button.displayName = "Button";

export default Button;
