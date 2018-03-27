import React from "react";
import { reduxForm, Field } from "redux-form";
import { reduxFormValidate } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button, { ButtonsGroup } from "../../../components/Button";
import { FormBlock } from "../../../components/Form";

const SignUpVerifyForm = ({ handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <FormBlock>
      <div>
        <Field
          name="email"
          placeholder="user@email.ua"
          component={FieldInput}
        />
      </div>

      <ButtonsGroup>
        <Button type="submit" color="blue" disabled={submitting}>
          Далі
        </Button>
      </ButtonsGroup>
    </FormBlock>
  </form>
);

export default reduxForm({
  form: "sign-up-verify-form",
  validate: reduxFormValidate({
    email: {
      required: true,
      email: true
    }
  })
})(SignUpVerifyForm);
