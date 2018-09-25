import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

import { ChevronBottomIcon } from "@ehealth/icons";
import Dropdown from "./Dropdown";

export const List = system({
  is: Dropdown.List,
  position: "absolute",
  top: "100%",
  zIndex: 10
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

export const DropdownButton = system(
  {
    is: "button",
    position: "absolute",
    right: 0,
    top: 0,
    width: "47px",
    height: "100%",
    cursor: "pointer"
  },
  variant({
    prop: "type",
    key: "inputs.button"
  })
);

export const DropdownIcon = system({
  is: ChevronBottomIcon,
  color: "jacarandaLight"
});
