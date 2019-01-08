import system from "@ehealth/system-components";
import { variant } from "@ehealth/system-tools";

export const Wrapper = system(
  {
    position: "relative",
    flexDirection: "column",
    alignItems: "stretch",
    maxWidth: "100%",
    blacklist: ["itemToString"]
  },
  `
    display: flex;
    &:last-child {
      margin-bottom: 0;
    }
  `,
  "space",
  "flexDirection",
  "position",
  "alignItems",
  "maxWidth"
);

export const Header = system(
  {
    mb: 2
  },
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  "space"
);

export const Footer = system(
  {
    extend: Header,
    mt: 1,
    mb: 1,
    height: 20
  },
  "space",
  "height"
);

export const Label = system(
  {
    color: "darkAndStormy",
    fontSize: 1
  },
  "fontSize",
  "color"
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
  "fontSize",
  "color"
);
