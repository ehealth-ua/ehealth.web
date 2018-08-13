import React from "react";
import { reduxForm, Field } from "redux-form";

import { reduxFormValidate } from "react-nebo15-validate";

import Form, { FormButtons } from "../../../components/Form";
import FieldInput from "../../../components/reduxForm/FieldInput";
import Button from "../../../components/Button";

const ResetAuthenticationMethodForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="person_id"
      labelText="Ідентифікатор людини"
      component={FieldInput}
    />
    <FormButtons>
      <Button type="submit">Скинути метод авторизації</Button>
    </FormButtons>
  </Form>
);

export default reduxForm({
  form: "reset-authentication-method-form",
  validate: reduxFormValidate({
    person_id: {
      required: true,
      uuid: true
    }
  })
})(ResetAuthenticationMethodForm);
