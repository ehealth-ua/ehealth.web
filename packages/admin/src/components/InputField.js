import React from "react";
import { Field } from "@ehealth/components";

import * as FieldView from "./FieldView";
import * as InputView from "./InputView";

const InputField = ({ label, hint, warning, prefix, postfix, ...props }) => (
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
          <InputView.Content {...input} is="input" />
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
