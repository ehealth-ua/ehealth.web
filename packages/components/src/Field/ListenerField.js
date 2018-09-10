import React from "react";
import Field from "./Field";
import { OnChange } from "react-final-form-listeners";

const ListenerField = ({ field, set, to, becomes }) => (
  <Field name={set} subscription={{}}>
    {({ input: { onChange } }) => (
      <OnChange name={field}>
        {value => (becomes ? becomes === value && onChange(to) : onChange(to))}
      </OnChange>
    )}
  </Field>
);

export default ListenerField;
