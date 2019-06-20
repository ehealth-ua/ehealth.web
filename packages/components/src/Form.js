import React from "react";
import { Form as FinalForm, FormSpy } from "react-final-form";
import createFocusDecorator from "final-form-focus";
import setFieldData from "final-form-set-field-data";
import arrayMutators from "final-form-arrays";
import styled from "@emotion/styled";
import { prop } from "styled-tools";
import { pickProps, normalizeErrors } from "@ehealth/utils";
import { Text } from "@rebass/emotion";
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
    { decorators = [], mutators, onSubmit, ...finalFormProps },
    formProps
  ] = pickProps(props, FINAL_FORM_PROPS);

  return (
    <FinalForm
      decorators={[focusOnErrors, ...decorators]}
      mutators={{ setFieldData, ...arrayMutators, ...mutators }}
      subscription={{}}
      onSubmit={async (...args) => {
        try {
          await onSubmit(...args);
        } catch (error) {
          if (Array.isArray(error.graphQLErrors)) {
            return normalizeErrors(error.graphQLErrors);
          } else {
            return error;
          }
        }
      }}
      {...finalFormProps}
    >
      {({ handleSubmit }) => (
        <>
          <form
            {...formProps}
            ref={innerRef}
            onSubmit={handleSubmit}
            method="POST"
          />
          <NonExistentInputError />
        </>
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

      const { rules } =
        invalid.find(
          i =>
            Array.isArray(entry) ? entry.includes(i.entry) : i.entry === entry
        ) || {};

      const rulesMatch = rules
        ? rules
        : invalid.reduce((prev, item) => [...prev, ...item.rules], []);

      const match = rulesMatch.find(({ rule }) =>
        Object.keys(props).includes(rule)
      );

      const result = rules
        ? match
          ? props[match.rule]
          : props.default
        : rulesMatch.reduce((prev, item) => `${item.description}. ${prev}`, "");

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

export const NonExistentInputError = () => (
  <FormSpy subscription={{ submitErrors: true }}>
    {({ submitErrors, form }) => {
      if (!submitErrors) return null;

      const renderedFormFields = form.getRegisteredFields();
      const uniqueFieldsWithError = Object.keys(submitErrors).filter(
        erroredField => !renderedFormFields.includes(erroredField)
      );

      return (
        <Heading.H4 textAlign="left">
          {uniqueFieldsWithError.map((field, key) => (
            <Text color="red" key={key}>
              {submitErrors[field].message}
            </Text>
          ))}
        </Heading.H4>
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
