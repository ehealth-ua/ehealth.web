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
import { CheckboxField, RadioField } from "./CheckableField";
import GroupField from "./GroupField";
import ArrayField from "./ArrayField";

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
            error: getError(meta)
          }
        })
      }
    />
  );
};

const isErrored = ({
  error,
  submitError,
  data = {},
  touched,
  dirtySinceLastSubmit
}) =>
  (error && touched) ||
  ((submitError || data.submitError) && !dirtySinceLastSubmit);

const getError = ({ error, submitError, data = {} }) =>
  error || submitError || data.submitError;

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
Field.Array = ArrayField;

export default Field;
