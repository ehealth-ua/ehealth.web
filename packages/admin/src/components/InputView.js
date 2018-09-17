import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

export const Border = system(
  {
    bg: "white",
    border: 1,
    borderColor: "silverCity",
    color: "darkAndStormy",
    fontSize: 1,
    lineHeight: 1,
    flexWrap: "nowrap",
    position: "static"
  },
  variant({
    prop: "state",
    key: "inputs.border.states"
  }),
  `
    display: flex;
  `
);

export const Content = system(
  {
    py: 2,
    flex: "1 1 auto"
  },
  `
    background: none;
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    outline: none;
    position: relative;
    text-align: left;

    &:disabled {
      -webkit-text-fill-color: inherit;
    }
  `,
  "space",
  "width"
);
