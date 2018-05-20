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
  "value"
];

const Field = ({ children, render = children, type, ...props }) => {
  const [fieldProps, inputProps] = pickProps(props, FINAL_FORM_FIELD_PROPS);

  return (
    <FinalFormField
      {...fieldProps}
      type={type}
      render={({ input, meta }) =>
        render({
          input: { ...inputProps, ...input, type },
          meta: {
            ...meta,
            errored: isErrored(meta),
            submitError: getSubmitError(meta)
          }
        })
      }
    />
  );
};

const isErrored = ({
  touched,
  submitFailed,
  dirtySinceLastSubmit,
  invalid,
  data = {}
}) =>
  (invalid || data.submitError) &&
  ((submitFailed && !dirtySinceLastSubmit) || touched);

const getSubmitError = ({ data = {}, submitError }) =>
  submitError || data.submitError;

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
