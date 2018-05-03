import React, { Children, cloneElement } from "react";
import { Field } from "react-final-form";
import validator from "validator";
import capitalize from "lodash/capitalize";

import SubmitValidation from "./SubmitValidation";

const VENDOR_BLACKLIST_FNS = [
  "isEmpty",
  "blacklist",
  "escape",
  "unescape",
  "ltrim",
  "normalizeEmail",
  "rtrim",
  "stripLow",
  "toBoolean",
  "toDate",
  "toFloat",
  "toInt",
  "trim",
  "whitelist"
];

const VENDOR_VALIDATORS = Object.entries(validator)
  .filter(([name]) => !VENDOR_BLACKLIST_FNS.includes(name))
  .reduce((validators, [name, fn]) => {
    const componentName = /^is/.test(name)
      ? name.replace(/^is/, "")
      : capitalize(name);

    return {
      ...validators,
      [componentName]: (value, ...args) => !value || fn(value, ...args)
    };
  }, {});

const CUSTOM_VALIDATORS = {
  Required: value =>
    (Array.isArray(value) && value.length > 0) ||
    (typeof value === "number" && !isNaN(value)) ||
    Boolean(value)
};

const PREDEFINED_VALIDATORS = { ...VENDOR_VALIDATORS, ...CUSTOM_VALIDATORS };

const Validation = ({ field, validate, validateFields, message, options }) => (
  <Field
    name={field}
    validate={(value, allValues) => {
      if (typeof options === "function") {
        options = options({ value, allValues });
      }

      if (typeof message === "function") {
        message = message({ value, allValues, options });
      }

      return validate(value, allValues, options) ? undefined : message;
    }}
    validateFields={validateFields}
    subscription={{}}
    component={Noop}
  />
);

const createValidationComponents = (baseComponent, validators) =>
  Object.entries(validators).reduce(
    (components, [name, validator]) => ({
      ...components,
      [name]: createAppliedValidationComponent(baseComponent, name, validator)
    }),
    {}
  );

const createAppliedValidationComponent = (baseComponent, name, validator) => {
  const validate = createValidateFn(validator);

  const AppliedValidation = props => baseComponent({ ...props, validate });
  AppliedValidation.displayName = `Validation.${name}`;

  return AppliedValidation;
};

const createValidateFn = validator => (value, _allValues, options) => {
  if (!Array.isArray(options)) options = [options];

  return validator(value, ...options);
};

Object.assign(Validation, {
  ...createValidationComponents(Validation, PREDEFINED_VALIDATORS),
  Submit: SubmitValidation
});

export default Validation;

export const Validations = ({ field, children }) => (
  <>{Children.map(children, child => cloneElement(child, { field }))}</>
);

const Noop = () => null;
