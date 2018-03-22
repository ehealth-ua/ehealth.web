import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { reduxForm, Field } from "redux-form";
import { ErrorMessage, reduxFormValidate } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button, { ButtonsGroup } from "../../../components/Button";

import styles from "./styles.module.css";

const ResetPasswordForm = ({ handleSubmit, submitting, router }) => (
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
      <Button theme="link" onClick={router.goBack}>
        Назад
      </Button>
    </ButtonsGroup>
  </form>
);

export default compose(
  withRouter,
  reduxForm({
    form: "reset-password-form",
    validate: reduxFormValidate({
      email: {
        required: true,
        email: true
      }
    })
  })
)(ResetPasswordForm);
