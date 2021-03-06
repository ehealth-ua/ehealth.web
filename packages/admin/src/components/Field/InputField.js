import React from "react";
import { Field } from "@ehealth/components";

import * as FieldView from "./FieldView";
import * as InputView from "./InputView";
import ErrorTranslation from "./ErrorTranslation";

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
  divider,
  is = "input",
  showLengthHint,
  ...props
}) => (
  <Field {...props}>
    {({ input, meta: { state, errored, error } }) => (
      <FieldView.Wrapper is="label">
        {(label || input.maxLength) && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
            {showLengthHint && (
              <FieldView.Message>
                Залишилось символів {input.maxLength - input.value.length}
              </FieldView.Message>
            )}
          </FieldView.Header>
        )}

        <InputView.Divider active={divider}>
          <InputView.Border variant={state}>
            {prefix && (
              <InputView.Content pl={2} flex="none">
                {prefix}
              </InputView.Content>
            )}
            <InputView.Content
              {...input}
              is={is}
              pl={prefix ? 2 : 3}
              pr={postfix ? 2 : 3}
            />
            {postfix && (
              <InputView.Content pr={2} flex="none">
                {postfix}
              </InputView.Content>
            )}
          </InputView.Border>
        </InputView.Divider>
        <FieldView.Footer>
          <FieldView.Message variant={state}>
            {errored ? <ErrorTranslation error={error} /> : warning}
          </FieldView.Message>
        </FieldView.Footer>
      </FieldView.Wrapper>
    )}
  </Field>
);

export default InputField;
