import React from "react";
import { Form as FinalForm, FormSpy } from "react-final-form";
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

const Form = ({ innerRef, ...props }) => {
  const [finalFormProps, formProps] = pickProps(props, FINAL_FORM_PROPS);

  return (
    <FinalForm {...finalFormProps}>
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

export default Form;
