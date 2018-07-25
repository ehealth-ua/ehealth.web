import React from "react";
import { Form as FinalForm, FormSpy } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import setFieldData from "final-form-set-field-data";
import arrayMutators from "final-form-arrays";
import styled from "react-emotion/macro";
import { prop } from "styled-tools";
import { pickProps } from "@ehealth/utils";
import { Text } from "rebass/emotion";
import debounce from "lodash/debounce";

import Button from "./Button";
import Heading from "./Heading";

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
  const [
    { decorators = [], mutators, ...finalFormProps },
    formProps
  ] = pickProps(props, FINAL_FORM_PROPS);

  return (
    <FinalForm
      decorators={[focusOnErrors, ...decorators]}
      mutators={{ setFieldData, ...arrayMutators, ...mutators }}
      subscription={{}}
      {...finalFormProps}
    >
      {({ handleSubmit }) => (
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

export const FormError = ({ entry = "$.data", ...props }) => (
  <FormSpy subscription={{ submitErrors: true }}>
    {({ submitErrors }) => {
      if (!submitErrors) return null;

      const { [SUBMIT_ERROR]: invalid } = submitErrors;
      if (!invalid) return null;

      const { rules } = invalid.find(i => i.entry === entry) || {};

      if (!rules) return null;
      const match = rules.find(({ rule }) => Object.keys(props).includes(rule));

      const result = match ? props[match.rule] : props.default;

      return typeof result === "function" ? (
        result(match)
      ) : (
        <Heading.H3>
          <Text color="red">{result}</Text>
        </Heading.H3>
      );
    }}
  </FormSpy>
);

export const FormAutoSubmit = ({ delay = 500, onSubmit }) => {
  const onSubmitDebounced = debounce(onSubmit, delay);
  return (
    <FormSpy
      subscription={{ values: true }}
      onChange={({ values }) => {
        return onSubmitDebounced(values);
      }}
    />
  );
};

Form.Button = FormButton;
Form.Submit = FormSubmit;
Form.AutoSubmit = FormAutoSubmit;
Form.Error = FormError;

export default Form;

export const SUBMIT_ERROR = "FINAL_FORM/submit-error";

const StyledButton = styled(Button)`
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;
`;
