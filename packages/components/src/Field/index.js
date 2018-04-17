import React from "react";
import { Field as FinalFormField } from "react-final-form";
import { pickProps } from "@ehealth/utils";

import {
  InputField,
  TextField,
  MultilineTextField,
  NumberField,
  PasswordField
} from "./InputField";
import SelectField from "./SelectField";
import FileField from "./FileField";
import { CheckboxField, RadioField, GroupField } from "./CheckableField";

const FINAL_FORM_FIELD_PROPS = [
  "allowNull",
  "format",
  "isEqual",
  "name",
  "parse",
  "subscription",
  "type",
  "value"
];

const Field = ({ children, render = children, ...props }) => {
  const [fieldProps, inputProps] = pickProps(props, FINAL_FORM_FIELD_PROPS);

  return (
    <FinalFormField
      {...fieldProps}
      render={({ input, meta }) =>
        render({
          input: { ...inputProps, ...input },
          meta: { ...meta, errored: isErrored(meta) }
        })
      }
    />
  );
};

const isErrored = ({ touched, submitFailed, dirtySinceLastSubmit, invalid }) =>
  invalid && (submitFailed ? !dirtySinceLastSubmit : touched);

Field.Input = InputField;
Field.Text = TextField;
Field.MultilineText = MultilineTextField;
Field.Number = NumberField;
Field.Password = PasswordField;
Field.Select = SelectField;
Field.File = FileField;
Field.Checkbox = CheckboxField;
Field.Radio = RadioField;
Field.Group = GroupField;

export default Field;
