import React from "react";
import { Field, Form, Validation, Validations } from "@ehealth/components";

const SignInForm = ({ onSubmit }) => (
  <Form onSubmit={onSubmit}>
    <Field.Input placeholder="E-mail" name="email" />
    <Validation.Required field="email" message="Об'язкове поле" />
    <Validation.Email field="email" message="Некоректний електронний адрес" />
    <Field.Input type="password" placeholder="Пароль" name="password" />
    <Validation.Required field="field" message="Об'язкове поле" />
    <Form.Submit type="submit" block>
      увійти
    </Form.Submit>
  </Form>
);

export default SignInForm;
