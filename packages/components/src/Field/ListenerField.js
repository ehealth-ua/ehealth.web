import React from "react";
import Field from "./Field";
import { OnChange } from "react-final-form-listeners";

const ListenerField = ({ field, becomes, set, to }) => (
  <Field name={set} subscription={{}}>
    {({ input: { onChange } }) => (
      <OnChange name={field}>
        {value => {
          if (value === becomes) {
            onChange(to);
          }
        }}
      </OnChange>
    )}
  </Field>
);

export default ListenerField;
