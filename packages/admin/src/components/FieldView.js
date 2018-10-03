import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

export const Wrapper = system(
  {
    position: "relative",
    flexDirection: "column",
    alignItems: "stretch",
    maxWidth: "100%"
  },
  `
    display: flex;

    &:last-child {
      margin-bottom: 0;
    }
  `,
  "space"
);

export const Header = system(
  {
    mb: 2
  },
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `
);

export const Footer = system({
  is: Header,
  mt: 1,
  mb: 1,
  height: 20
});

export const Label = system(
  {
    color: "darkAndStormy",
    fontSize: 1
  },
  "space"
);

export const Message = system(
  {
    color: "shiningKnight",
    fontSize: 0
  },
  variant({
    prop: "state",
    key: "fields.message.states"
  }),
  "space"
);
