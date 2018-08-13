import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";
import FieldCheckbox from "../../../components/reduxForm/FieldCheckbox";
import { FormRow, FormColumn } from "../../../components/Form";

import Button from "../../../components/Button";

import ShowWithScope from "../../blocks/ShowWithScope";

import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";

import styles from "./styles.module.css";

class ProgramMedicationForm extends React.Component {
  render() {
    const { handleSubmit, onSubmit = () => {}, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <FormRow>
            <FormColumn>
              <Field
                name="id"
                labelText="ID Учасника"
                component={FieldInput}
                disabled
                theme="disabled"
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="medication.name"
                labelText="Торгівельне найменування"
                component={FieldInput}
                disabled
                theme="disabled"
              />
            </FormColumn>
            <FormColumn>
              <Field
                name="medication.id"
                labelText="ID торгової назви"
                component={FieldInput}
                disabled
                readonly
                theme="disabled"
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="medical_program.name"
                labelText="Медична программа"
                component={FieldInput}
                disabled
                theme="disabled"
              />
            </FormColumn>
            <FormColumn>
              <Field
                name="medical_program.id"
                labelText="ID медичної програми"
                component={FieldInput}
                disabled
                theme="disabled"
              />
            </FormColumn>
          </FormRow>

          <div>
            <Field
              name="reimbursement.type"
              component={FieldInput}
              labelText="Тип"
              theme="disabled"
              disabled
            >
              <ErrorMessage when="required">Обов&#700;язкове поле</ErrorMessage>
            </Field>
          </div>
          <div>
            <Field
              name="reimbursement.reimbursement_amount"
              labelText="Сума відшкодування"
              component={FieldInput}
              placeholder="Введіть суму відшкодування в гривнях"
            />
          </div>
          <div>
            <Field
              name="is_active"
              labelText="Активний"
              component={FieldCheckbox}
            />
          </div>
          <div>
            <Field
              name="medication_request_allowed"
              labelText="Дозвіл на створення рецептів"
              component={FieldCheckbox}
            />
          </div>
          <ShowWithScope scope="program_medication:write">
            <div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Збереження..." : "Оновити"}
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
    form: "program-medication-update-form",
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
    values: getFormValues("program-medication-update-form")(state)
  }))
)(ProgramMedicationForm);
