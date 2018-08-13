import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button from "../../../components/Button";
import { FormRow, FormColumn } from "../../../components/Form";

import ShowWithScope from "../../blocks/ShowWithScope";

import { reduxFormValidate } from "react-nebo15-validate";

import styles from "./styles.module.css";

class InnmForm extends React.Component {
  render() {
    const {
      handleSubmit,
      onSubmit = () => {},
      submitting,
      disabled = false,
      create
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          {!create && (
            <div>
              <Field
                name="id"
                labelText="ID"
                component={FieldInput}
                disabled={disabled}
              />
            </div>
          )}
          <div>
            <Field
              name="name"
              labelText="Назва МНН"
              component={FieldInput}
              disabled={disabled}
              placeholder="Аміодарон"
            />
          </div>
          <div>
            <Field
              name="name_original"
              labelText="Оригінальна назва МНН"
              component={FieldInput}
              disabled={disabled}
              placeholder="Amiodarone"
            />
          </div>
          {!create && (
            <div>
              <Field
                name="sctid"
                labelText="sctid МНН"
                component={FieldInput}
                placeholder="-"
              />
            </div>
          )}
          {create && (
            <div>
              <Field
                name="sctid"
                labelText="sctid МНН"
                component={FieldInput}
                disabled={disabled}
                placeholder="98730785"
              />
            </div>
          )}
          <FormRow>
            <FormColumn>
              {!disabled && (
                <ShowWithScope scope="innm:write">
                  <div>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Збереження" : "Створити МНН"}
                    </Button>
                  </div>
                </ShowWithScope>
              )}
            </FormColumn>
          </FormRow>
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: "innm-form",
    validate: reduxFormValidate({
      sctid: {
        length: 8
      },
      name: {
        required: true
      },
      name_original: {
        required: true
      }
    })
  }),
  connect(state => ({
    values: getFormValues("innm-form")(state)
  }))
)(InnmForm);
