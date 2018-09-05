import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

export const Border = system(
  {
    bg: "white",
    border: 1,
    borderColor: "silverCity",
    color: "darkAndStormy",
    fontSize: 1,
    lineHeight: 1
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
    px: 3
  },
  `
    background: none;
    border: none;
    width: auto;
    overflow: hidden;
    color: inherit;
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    outline: none;
    position: relative;
    text-align: left;

    &:nth-child(n+2):nth-last-child(n+2) {
      padding-left: 0;
      padding-right: 0;
    }

    &:nth-child(2):nth-last-child(1) {
      padding-left: 0;
    }

    &:disabled {
      -webkit-text-fill-color: inherit;
    }
  `
);