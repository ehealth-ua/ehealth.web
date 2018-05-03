import React from "react";
import { FormSpy } from "react-final-form";

import { SUBMIT_ERROR } from "./Form";

const SubmitValidation = ({
  field,
  entry = `$.${field}`,
  rule = "invalid",
  message
}) => (
  <FormSpy subscription={{}}>
    {({ form }) => (
      <FormSpy
        subscription={{ submitErrors: true }}
        onChange={({ submitErrors = {} }) => {
          const { [SUBMIT_ERROR]: invalid } = submitErrors;

          if (!Array.isArray(invalid)) return;

          const error = invalid.find(
            ({ entry: e, rules }) =>
              e === entry && rules.some(({ rule: r }) => r === rule)
          );

          if (!error) return;

          form.mutators.setFieldData(field, { submitError: message });
        }}
      />
    )}
  </FormSpy>
);

export default SubmitValidation;
