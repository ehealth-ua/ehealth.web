import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { Form, Validation, Validations, Field } from "@ehealth/components";

import Button, { ButtonsGroup } from "../../../components/Button";

const ResetPasswordForm = ({ onSubmit, submitting, router }) => (
  <Form onSubmit={onSubmit}>
    <Field.Input
      placeholder="Введіть свою адресу електронної пошти"
      name="email"
    />
    <Validations field="email">
      <Validation.Required message="Об'язкове поле" />
      <Validation.Email message="Некоректний електронний адрес" />
      <Validation.Submit
        rule="existence"
        message="Користувача з таким email не існує"
      />
    </Validations>
    <Form.Submit disabled={submitting} type="submit" color="blue" block>
      далі
    </Form.Submit>
    <Button theme="link" onClick={router.goBack}>
      Назад
    </Button>
  </Form>
);

export default compose(withRouter)(ResetPasswordForm);
