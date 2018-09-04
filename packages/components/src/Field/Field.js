// @flow
import * as React from "react";
import * as FinalForm from "react-final-form";
import { pickProps } from "@ehealth/utils";

const FINAL_FORM_FIELD_PROPS = [
  "allowNull",
  "format",
  "formatOnBlur",
  "isEqual",
  "name",
  "parse",
  "validate",
  "validateFields",
  "subscription",
  "value"
];

const FIELD_STATES = ["disabled", "errored", "active"];

type FieldState = "disabled" | "errored" | "active";

type FieldRenderProp = ({
  input: $PropertyType<FinalForm.FieldRenderProps, "input">,
  meta: $PropertyType<FinalForm.FieldRenderProps, "meta"> & {
    state?: FieldState,
    errored: boolean,
    error?: string
  }
}) => React.Node;

type FieldProps = {
  children?: FieldRenderProp,
  render?: FieldRenderProp,
  type: string
} & FinalForm.FieldProps;

const Field = ({
  children,
  // $FlowFixMe https://github.com/facebook/flow/issues/6832
  render = children,
  type,
  ...props
}: FieldProps): React.Node => {
  const [fieldProps, inputProps] = pickProps(props, FINAL_FORM_FIELD_PROPS);

  if (typeof render !== "function") {
    return null;
  }

  return (
    <FinalForm.Field
      {...fieldProps}
      type={type}
      render={({ input, meta }) =>
        render({
          input: { ...inputProps, ...input, type },
          meta: {
            ...meta,
            state: getFieldState(inputProps, meta),
            errored: isErrored(meta),
            error: getError(meta)
          }
        })
      }
    />
  );
};

export default Field;

const getFieldState = (
  inputProps: { disabled?: boolean },
  meta: $PropertyType<FinalForm.FieldRenderProps, "meta">
): ?FieldState => {
  const { disabled } = inputProps;
  const { active } = meta;
  const errored = isErrored(meta);

  const flags = [disabled, errored, active];

  return FIELD_STATES.find((_name, index) => flags[index]);
};

const isErrored = ({
  error,
  submitError,
  data = {},
  touched,
  dirtySinceLastSubmit
}: $PropertyType<FinalForm.FieldRenderProps, "meta">): boolean =>
  (error && touched) ||
  ((submitError || data.submitError) && !dirtySinceLastSubmit);

const getError = ({
  error,
  submitError,
  data = {}
}: $PropertyType<FinalForm.FieldRenderProps, "meta">): string =>
  error || submitError || data.submitError;
