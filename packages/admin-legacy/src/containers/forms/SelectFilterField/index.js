import React, { Component } from "react";

import { Field } from "redux-form";

import FieldSelect from "../../../components/reduxForm/FieldSelect";

import styles from "./styles.module.css";

class SelectFilterField extends Component {
  componentDidMount() {
    this.initForm();
  }

  render() {
    const { name, labelText, placeholder, options, validate } = this.props;

    return (
      <div className={styles.select}>
        <Field
          component={FieldSelect}
          name={name}
          labelText={labelText}
          placeholder={placeholder}
          options={options}
          validate={validate ? [validate] : undefined}
          labelBold
        />
      </div>
    );
  }

  initForm() {
    const { initFields, query, name, defaultValue } = this.props;
    const values = { [name]: query[name] || defaultValue };

    initFields(values);
  }
}

export default SelectFilterField;
