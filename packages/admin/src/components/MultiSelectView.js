import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

import Dropdown from "./Dropdown";

export const List = system({
  is: Dropdown.List,
  position: "absolute",
  top: "100%"
});

export const SelectedItem = system({
  display: "flex",
  alignItems: "center",
  bg: "boysenberryShadow",
  border: 1,
  borderColor: "hintOfCandela",
  borderRadius: 1,
  color: "biroBlue",
  height: "30px",
  px: 2,
  m: "2px 0 0 2px"
});

export const RemoveItem = system({
  is: "button",
  p: 0,
  ml: 2
});

export const DropdownArrow = system(
  {
    is: "button",
    position: "absolute",
    right: 0,
    top: 0,
    width: "47px",
    height: "100%",
    cursor: "pointer"
  },
  `
    &::after {
      content: "";
      display: inline-block;
      width: 5px;
      height: 5px;
      border: 1px solid #a8aab7;
      border-width: 1px 1px 0 0;
      transform: rotate(135deg);
      margin: 0 10px;
      vertical-align: middle;
    }
  `
);
