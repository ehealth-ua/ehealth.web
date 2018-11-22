import system from "system-components/emotion";
import { boolean } from "@ehealth/system-tools";

import { ChevronBottomIcon, AdminSearchIcon } from "@ehealth/icons";
import Dropdown from "./Dropdown";

export const List = system(
  {
    is: Dropdown.List,
    position: "absolute",
    top: "100%",
    width: "100%",
    zIndex: 10,
    maxHeight: "450px"
  },
  {
    overflowY: "scroll"
  }
);

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

export const DropdownButton = system(
  {
    is: "div",
    position: "absolute",
    display: "flex",
    right: 0,
    top: 0,
    px: 3,
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  boolean({
    prop: "type",
    key: "inputs.button.fullWidth"
  })
);

export const DropdownIcon = system({
  is: ChevronBottomIcon,
  color: "jacarandaLight",
  width: "7px",
  height: "4px"
});

export const SearchIcon = system({
  is: AdminSearchIcon,
  color: "#CED0DA",
  width: "14px",
  height: "14px"
});
