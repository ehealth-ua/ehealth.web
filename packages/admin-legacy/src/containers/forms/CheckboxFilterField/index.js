import React from "react";
import classnames from "classnames";

import { Field } from "redux-form";

import styles from "./styles.module.css";

import FieldCheckbox from "../../../components/reduxForm/FieldCheckbox";

const CheckboxFilterField = ({ name, title, fullWidth }) => (
  <div
    className={classnames(styles.checkbox, {
      [styles.fullWidth]: fullWidth
    })}
  >
    <Field name={name} labelText={title} component={FieldCheckbox} />
  </div>
);

export default CheckboxFilterField;
