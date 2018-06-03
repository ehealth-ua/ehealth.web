import React from "react";

import Input from "../Input";

const FieldInput = ({
  component: Component = Input,
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
