import React from "react";

import { reduxForm, Field } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";

import { reduxFormValidate } from "react-nebo15-validate";

import styles from "./styles.module.css";

class EdrpouFilterForm extends React.Component {
  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form className={styles.main} onSubmit={handleSubmit}>
        <div>
          <Field
            type="number"
            placeholder="ЕДРПОУ"
            name="edrpou"
            component={FieldInput}
          />
        </div>
        <div>
          <button className={styles.button} disabled={submitting} type="submit">
            Пошук
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: "edrpou-filter-form",
  validate: reduxFormValidate({
    edrpou: {
      maxLength: 10
    }
  })
})(EdrpouFilterForm);
