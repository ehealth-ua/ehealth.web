import React from "react";
import { Field as FinalFormField } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { pickProps } from "@ehealth/utils";

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

export const ListenerChange = ({ field, becomes, set, to }) => (
  <Field name={set} subscription={{}}>
    {({ input: { onChange } }) => (
      <OnChange name={field}>
        {value => {
          if (value === becomes) {
            onChange(to);
          }
        }}
      </OnChange>
    )}
  </Field>
);

export default Field;

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
