import React from "react";
import system from "system-components/emotion";

const Button = system(
  {
    is: "button",
    border: 1,
    fontSize: 1,
    lineHeight: 1,
    px: 3,
    py: 1,
    variant: "light"
  },
  `
    display: inline-block;
    vertical-align: middle;
    outline: none;
  `
);

Button.displayName = "Button";

export default Button;
