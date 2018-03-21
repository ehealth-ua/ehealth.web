import React from "react";

import Input from "../Input";

const FieldInput = ({
  Component = Input,
  input,
  meta: { active, dirty, error, submitFailed },
  ...props
}) => (
  <Component
    {...input}
    active={active}
    error={(submitFailed || (dirty && !active)) && error}
    {...props}
  />
);

export default FieldInput;
