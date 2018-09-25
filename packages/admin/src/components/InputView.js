import system from "system-components/emotion";
import { variant, boolean } from "@ehealth/system-tools";

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
  variant({
    prop: "type",
    key: "inputs.field"
  }),
  boolean({
    prop: "disabled",
    key: "inputs.field.disabled"
  }),
  `
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
  "display",
  "justifyContent",
  "alignItems",
  "space",
  "width"
);
