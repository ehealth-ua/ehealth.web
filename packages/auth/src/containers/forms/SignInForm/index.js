import React from "react";
import { reduxForm, Field } from "redux-form";
import { reduxFormValidate } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import { Button } from "@ehealth/components";
import { FormBlock } from "../../../components/Form";

const SignInForm = ({ handleSubmit, submitting, btnColor = "blue" }) => (
  <form onSubmit={handleSubmit}>
    <FormBlock>
      <div>
        <Field placeholder="E-mail" name="email" component={FieldInput} />
      </div>
      <div>
        <Field
          type="password"
          placeholder="Пароль"
          name="password"
          component={FieldInput}
        />
      </div>
      <div>
        <Button disabled={submitting} type="submit" color={btnColor} block>
          увійти
        </Button>
      </div>
    </FormBlock>
  </form>
);

export default reduxForm({
  form: "sign-in-form",
  validate: reduxFormValidate({
    email: {
      required: true,
      email: true
    },
    password: {
      required: true
    }
  })
})(SignInForm);
