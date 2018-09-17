import system from "system-components/emotion";

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
