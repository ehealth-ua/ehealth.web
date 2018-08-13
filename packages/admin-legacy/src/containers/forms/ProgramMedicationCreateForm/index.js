import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";
import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";

import { SelectUniversal } from "../../../components/SelectUniversal";
import FieldInput from "../../../components/reduxForm/FieldInput";
import { FormRow, FormColumn } from "../../../components/Form";
import Button from "../../../components/Button";

import ShowWithScope from "../../blocks/ShowWithScope";

import styles from "./styles.module.css";

class ProgramMedicationCreateForm extends React.Component {
  state = {
    medical_program_search: ""
  };
  render() {
    const {
      handleSubmit,
      onSubmit = () => {},
      data = [],
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <FormRow>
            <FormColumn>
              <Field
                name="medication_id"
                labelText="ID торгової назви"
                component={FieldInput}
                placeholder="Введіть ідентифікатор торгової назви"
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="medical_program"
                labelText="Медична программа"
                component={SelectUniversal}
                searchable
                onChangeSearch={v =>
                  this.setState({
                    medical_program_search: v.toLowerCase()
                  })
                }
                options={Object.values(data)
                  .filter(i => i.id)
                  .filter(i => i.is_active)
                  .filter(
                    i =>
                      new RegExp(this.state.medical_program_search).test(
                        i.name.toLowerCase()
                      ) === true
                  )
                  .map(i => ({
                    title: i.name,
                    name: i.id
                  }))}
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
            </FormColumn>
          </FormRow>
          <div>
            <Field
              name="reimbursement.reimbursement_amount"
              labelText="Сума відшкодування"
              component={FieldInput}
              placeholder="Введіть cуму відшкодування в гривнях"
            />
          </div>
          <ShowWithScope scope="program_medication:write">
            <div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Збереження..." : "Створити"}
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
    form: "program-medication-create-form",
    validate: reduxFormValidate({
      fixed: {
        required: true
      },
      "reimbursement.reimbursement_amount": {
        required: true
      }
    })
  }),
  connect(state => ({
    values: getFormValues("program-medication-create-form")(state)
  }))
)(ProgramMedicationCreateForm);
