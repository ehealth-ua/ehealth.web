import system from "@ehealth/system-components";
import { variant, boolean } from "@ehealth/system-tools";

export const Border = system(
  {
    bg: "white",
    borderColor: "silverCity",
    color: "darkAndStormy",
    position: "static",
    fontSize: 1
  },
  {
    display: "flex",
    lineHeight: 1,
    flexWrap: "nowrap",
    borderWidth: 1,
    borderStyle: "solid"
  },
  variant({
    prop: "state",
    key: "inputs.border.states"
  }),
  "color",
  "space",
  "position",
  "borderColor",
  "fontSize"
);

export const Content = system(
  {
    py: 2,
    flex: "1 1 auto",
    blacklist: ["itemToString", "propTypes", "onInputValueChange"]
  },
  `
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    outline: none;
    position: relative;
    text-align: left;
    text-overflow: ellipsis;

    &:disabled {
      -webkit-text-fill-color: inherit;
    }

    &::placeholder {
      color: inherit;
      opacity: 0.5;
    }
  `,
  variant({
    prop: "variant",
    key: "inputs.field"
  }),
  boolean({
    prop: "disabled",
    key: "inputs.field.disabled"
  }),
  "display",
  "justifyContent",
  "alignItems",
  "flex",
  "space",
  "width"
);

export const Divider = system(
  {
    blacklist: ["propTypes"]
  },
  boolean({
    prop: "active",
    key: "inputs.divider.active"
  })
);
