import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button from "../../../components/Button";

import ShowWithScope from "../../blocks/ShowWithScope";

import { reduxFormValidate } from "react-nebo15-validate";

import styles from "./styles.module.css";

const terms = {
  DAYS: "дні",
  YEARS: "роки"
};

class ApiForm extends React.Component {
  get isChanged() {
    const { values = {}, initialValues = {} } = this.props;
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }

  render() {
    const { handleSubmit, initialValues, onSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <div>
            <Field
              name="declaration_term"
              labelText={`Термін декларації (${
                terms[initialValues.declaration_term_unit]
              })`}
              component={FieldInput}
            />
          </div>
          <div>
            <Field
              name="declaration_limit"
              labelText="Максимальна кількість декларацій"
              component={FieldInput}
            />
          </div>

          <div>
            <Field
              name="declaration_request_expiration"
              labelText={`Термін дії запиту декларації (${
                terms[initialValues.declaration_request_term_unit]
              })`}
              component={FieldInput}
            />
          </div>
          <div>
            <Field
              name="employee_request_expiration"
              labelText={`Термін дії запиту співробітників (${
                terms[initialValues.employee_request_term_unit]
              })`}
              component={FieldInput}
            />
          </div>
          <div>
            <Field
              name="verification_request_expiration"
              labelText={`Термін дії запиту перевірки (${
                terms[initialValues.verification_request_term_unit]
              })`}
              component={FieldInput}
            />
          </div>
          <div>
            <Field
              type="number"
              name="adult_age"
              labelText="Дорослий вік"
              component={FieldInput}
            />
          </div>
          <div>
            <Field
              min="1"
              max="28"
              type="number"
              name="billing_date"
              labelText="Дата розрахунку"
              component={FieldInput}
            />
          </div>
          <div>
            <Field name="bi_url" labelText="BI URL" component={FieldInput} />
          </div>
          <ShowWithScope scope="global_parameters:write">
            <div>
              <Button type="submit" disabled={!this.isChanged || submitting}>
                {submitting ? "Збереження..." : "Зберегти конфігурацію"}
              </Button>
            </div>
          </ShowWithScope>
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: "system-configuration-form",
    validate: reduxFormValidate({
      declaration_term: {
        required: true
      },
      declaration_request_expiration: {
        required: true
      },
      declaration_limit: {
        required: true
      },
      employee_request_expiration: {
        required: true
      },
      verification_request_expiration: {
        required: true
      },
      adult_age: {
        required: true
      },
      billing_date: {
        required: true,
        min: 1,
        max: 28
      },
      bi_url: {
        required: true,
        url: true
      }
    })
  }),
  connect(state => ({
    values: getFormValues("system-configuration-form")(state)
  }))
)(ApiForm);
