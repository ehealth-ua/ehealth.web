import React, { Component } from "react";

import { Field } from "redux-form";

import FieldDate from "../../../components/reduxForm/FieldDatepicker";

import styles from "./styles.module.css";

class DateFilterField extends Component {
  componentDidMount() {
    this.initForm();
  }

  render() {
    const { filters, requiredStar = false } = this.props;
    return (
      <div className={styles.date}>
        {filters.map(({ name, labelText, placeholder, validate }) => (
          <div
            key={name}
            className={filters.length > 1 ? styles.inputs : styles.input}
          >
            <Field
              label_bold
              name={name}
              component={FieldDate}
              dateFormat="DD.MM.YYYY"
              labelText={labelText}
              requiredStar={requiredStar}
              placeholder={placeholder}
              validate={validate ? [validate] : undefined}
            />
          </div>
        ))}
      </div>
    );
  }

  initForm() {
    const { initFields, filters, query } = this.props;

    const values = filters
      .filter(({ name }) => Object.hasOwnProperty.call(query, name))
      .reduce((fields, { name }) => ({ ...fields, [name]: query[name] }), {});

    initFields(values);
  }
}

export default DateFilterField;
