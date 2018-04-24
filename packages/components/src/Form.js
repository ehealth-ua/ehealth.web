import React from "react";
import { Form as FinalForm, FormSpy } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import styled from "react-emotion/macro";
import { prop } from "styled-tools";
import { pickProps } from "@ehealth/utils";

import Button from "./Button";

const FINAL_FORM_PROPS = [
  "debug",
  "decorators",
  "initialValues",
  "mutators",
  "onSubmit",
  "subscription",
  "validate",
  "validateOnBlur"
];

const focusOnErrors = createFocusDecorator();

const Form = ({ innerRef, ...props }) => {
  const [{ decorators = [], ...finalFormProps }, formProps] = pickProps(
    props,
    FINAL_FORM_PROPS
  );

  return (
    <FinalForm decorators={[focusOnErrors, ...decorators]} {...finalFormProps}>
      {({ handleSubmit, values }) => (
        <form
          {...formProps}
          ref={innerRef}
          onSubmit={handleSubmit}
          method="POST"
        />
      )}
    </FinalForm>
  );
};

export const FormButton = props => (
  <StyledButton
    type={props.to || props.href ? undefined : "button"}
    {...props}
  />
);

export const FormSubmit = ({ disabled, ...props }) => (
  <FormSpy subscription={{ submitting: true }}>
    {({ submitting }) => (
      <FormButton {...props} disabled={disabled || submitting} type="submit" />
    )}
  </FormSpy>
);

Form.Button = FormButton;
Form.Submit = FormSubmit;

export default Form;

const StyledButton = styled(Button)`
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;

  &:last-child {
    margin-bottom: 0;
  }
`;
