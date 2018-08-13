import React from "react";
import DatepickerInput from "../../DatepickerInput";

import FieldInput from "../FieldInput";

const Component = ({ dateFormat, ...props }) => (
  <FieldInput
    {...props}
    {...{
      component: DatepickerInput,
      dateFormat
    }}
  />
);

export default Component;
