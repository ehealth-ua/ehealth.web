import React from "react";

import { reduxForm, Field } from "redux-form";

import FieldDate from "../../../components/reduxForm/FieldDatepicker";
import { FormRow, FormColumn } from "../../../components/Form";

import styles from "./styles.module.css";

class DateFilterForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submitting,
      items: [startFieldName, endFieldName],
      submitTitle
    } = this.props;

    return (
      <div>
        <form className={styles.main} onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn align="baseline">
              <Field
                name={startFieldName}
                component={FieldDate}
                dateFormat="YYYY-MM-DD"
                labelText="Початкова дата"
                placeholder="2017-10-25"
              />
            </FormColumn>
            <FormColumn align="baseline">
              <Field
                name={endFieldName}
                component={FieldDate}
                dateFormat="YYYY-MM-DD"
                labelText="Кінцева дата"
                placeholder="2018-09-26"
              />
            </FormColumn>
            <FormColumn align="baseline">
              <button
                className={styles.button}
                disabled={submitting}
                type="submit"
              >
                {submitTitle ? submitTitle : "Пошук"}
              </button>
            </FormColumn>
          </FormRow>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: "dates-range-filter-form"
})(DateFilterForm);
