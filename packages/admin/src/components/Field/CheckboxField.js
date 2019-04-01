import React from "react";
import { Flex, Box } from "@rebass/emotion";
import { Field } from "@ehealth/components";
import { CheckMarkIcon } from "@ehealth/icons";
import system from "@ehealth/system-components";
import { variant, boolean } from "@ehealth/system-tools";

const CheckboxField = ({ label, disabled, ...props }) => (
  <Field {...props} type="checkbox">
    {({ input: { checked, ...input }, meta: { active, errored } }) => (
      <Wrapper>
        <Input {...input} disabled={disabled} />
        <CheckBox
          checked={checked}
          active={active}
          errored={errored}
          disabled={disabled}
        >
          <CheckMark checked={checked} />
        </CheckBox>
        <Box>{label}</Box>
      </Wrapper>
    )}
  </Field>
);

const Wrapper = system(
  {
    is: "label",
    fontSize: 1
  },
  {
    display: "flex",
    alignItems: "center",
    position: "relative"
  },
  "fontSize",
  `
    user-select: none
  `
);

const Input = system(
  {
    is: "input"
  },
  {
    position: "absolute",
    opacity: 0
  }
);

const CheckBox = system(
  {
    is: Flex,
    mx: 2,
    variant: "default"
  },
  {
    height: 16,
    width: 16,
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1
  },
  variant({
    key: "inputs.field.checkbox"
  }),
  boolean({
    prop: "checked",
    key: "inputs.field.checkbox.checked"
  }),
  "space"
);

const CheckMark = system(
  {
    is: CheckMarkIcon
  },
  {
    width: 8,
    height: 6,
    margin: "auto",
    opacity: 0
  },
  boolean({
    prop: "checked",
    key: "inputs.field.checkbox.checked"
  })
);

export default CheckboxField;
