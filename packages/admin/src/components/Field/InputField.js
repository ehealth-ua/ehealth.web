import React from "react";
import { Field } from "@ehealth/components";

import * as FieldView from "../FieldView";
import * as InputView from "../InputView";

export const TextField = props => <InputField {...props} type="text" />;

export const TextareaField = props => <InputField {...props} is="textarea" />;

export const NumberField = props => <InputField {...props} type="number" />;

export const PasswordField = props => <InputField {...props} type="password" />;

const InputField = ({
  label,
  hint,
  warning,
  prefix,
  postfix,
  is = "input",
  ...props
}) => (
  <Field {...props}>
    {({ input, meta: { state, errored, error } }) => (
      <FieldView.Wrapper is="label">
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}

        <InputView.Border state={state}>
          {prefix && <InputView.Content px={2}>{prefix}</InputView.Content>}
          <InputView.Content {...input} is={is} />
          {postfix && <InputView.Content px={2}>{postfix}</InputView.Content>}
        </InputView.Border>

        <FieldView.Footer>
          <FieldView.Message state={state}>
            {errored ? error : warning}
          </FieldView.Message>
        </FieldView.Footer>
      </FieldView.Wrapper>
    )}
  </Field>
);

export default InputField;