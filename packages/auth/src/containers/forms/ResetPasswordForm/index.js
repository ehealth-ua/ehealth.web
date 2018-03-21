import React from "react";
import { reduxForm, Field } from "redux-form";
import { ErrorMessage, reduxFormValidate } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button, { ButtonsGroup } from "../../../components/Button";

import styles from "./styles.module.css";

const ResetPasswordForm = ({ handleSubmit, submitting }) => (
  <form className={styles.main} onSubmit={handleSubmit}>
    <div>
      <Field
        placeholder="Введіть свою адресу електронної пошти"
        name="email"
        component={FieldInput}
      >
        <ErrorMessage when="accountPasswordMismatch">
          Користувача з таким email не існує
        </ErrorMessage>
      </Field>
    </div>
    <ButtonsGroup>
      <Button disabled={submitting} type="submit" color="blue">
        далі
      </Button>
      <Button to="/sign-in" theme="link">
        Назад
      </Button>
    </ButtonsGroup>
  </form>
);

export default reduxForm({
  form: "reset-password-form",
  validate: reduxFormValidate({
    email: {
      required: true,
      email: true
    }
  })
})(ResetPasswordForm);
