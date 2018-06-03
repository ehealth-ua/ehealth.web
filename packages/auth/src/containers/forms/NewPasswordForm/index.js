import React from "react";
import { reduxForm, Field } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button from "../../../components/Button";
import { FormBlock } from "../../../components/Form";
import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";
import { password_validate } from "../../../helpers/validate";

const NewPasswordForm = ({ handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <FormBlock>
      <div>
        <Field
          placeholder="Введіть новий пароль"
          name="password"
          type="password"
          component={FieldInput}
        >
          <ErrorMessage when="format">
            Пароль повинен містити великі, малі літери та цифри
          </ErrorMessage>
          <ErrorMessage when="length">
            Повинен складатися хоча б з 12 символів
          </ErrorMessage>
          <ErrorMessage when="password_used">
            Даний пароль уже використовувався раніше. Спробуйте інший
          </ErrorMessage>
        </Field>
      </div>
      <div>
        <Field
          placeholder="Повторіть новий пароль"
          name="confirm_password"
          type="password"
          component={FieldInput}
        >
          <ErrorMessage when="confirmation">
            Паролі не співпадаюсть
          </ErrorMessage>
        </Field>
      </div>
      <div>
        <Button disabled={submitting} type="submit" color="blue">
          Зберегти новий пароль
        </Button>
      </div>
    </FormBlock>
  </form>
);

export default reduxForm({
  form: "new-password-form",
  validate: reduxFormValidate({
    password: {
      ...password_validate
    },
    confirm_password: {
      required: true,
      confirmation: "password"
    }
  })
})(NewPasswordForm);
