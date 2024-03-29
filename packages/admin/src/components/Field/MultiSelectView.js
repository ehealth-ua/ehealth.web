import system from "@ehealth/system-components";
import { variant } from "@ehealth/system-tools";

import Dropdown from "../Dropdown";

export const List = system(
  {
    extend: Dropdown.List
  },
  {
    position: "absolute",
    top: "100%",
    width: "100%",
    zIndex: 10,
    maxHeight: "300px",
    overflowY: "scroll"
  }
);

export const SelectedItem = system(
  {
    bg: "boysenberryShadow",
    px: 2,
    m: "2px 0 0 2px",
    fontSize: 1,
    color: "biroBlue",
    borderColor: "hintOfCandela"
  },
  {
    display: "flex",
    alignItems: "center",
    border: 1,
    borderRadius: 2,
    height: "30px"
  },
  "space",
  "color",
  "fontSize"
);

export const RemoveItem = system(
  {
    is: "button",
    p: 0,
    ml: 2
  },
  "space"
);

export const DropdownButton = system(
  {
    as: "div",
    px: 3
  },
  {
    position: "absolute",
    display: "flex",
    right: 0,
    top: 0,
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  variant({
    prop: "variant",
    key: "inputs.button"
  }),
  "space"
);
