import React from "react";
import system from "system-components/emotion";
import { variant } from "@ehealth/system-tools";

const Svg = ({ selected, disabled, ...props }) => {
  const colorState = disabled ? "disabled" : selected ? "selected" : "inactive";
  const selectedState = selected
    ? disabled
      ? "disabled"
      : "selected"
    : "inactive";

  return (
    <svg {...props}>
      <defs>
        <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="selected">
          <stop stop-color="#29B311" offset="0%" />
          <stop stop-color="#57D841" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="inactive">
          <stop stop-color="#F2F4F8" offset="0%" />
          <stop stop-color="#FEFFFF" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="disabled">
          <stop stop-color="#E9EDF1" offset="0%" />
          <stop stop-color="#E9EDF1" offset="100%" />
        </linearGradient>
        <rect id="b" width="16" height="16" rx="8" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={`url(#${colorState})`} href="#b" />
        <Border
          state={colorState}
          x=".5"
          y=".5"
          width="15"
          height="15"
          rx="7.5"
        />
        <Selected state={selectedState} cx="8" cy="8" r="3" />
      </g>
    </svg>
  );
};

const RadioIcon = system({
  is: Svg,
  width: "16px",
  height: "16px",
  mr: "15px"
});

const Border = system(
  {
    is: "rect"
  },
  variant({
    prop: "state",
    key: "radios.border.states"
  })
);

const Selected = system(
  {
    is: "circle"
  },
  variant({
    prop: "state",
    key: "radios.circle.states"
  })
);

export default RadioIcon;
