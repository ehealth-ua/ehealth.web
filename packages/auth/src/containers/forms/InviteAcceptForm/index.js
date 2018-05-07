import React from "react";
import { reduxForm } from "redux-form";
import { reduxFormValidate } from "react-nebo15-validate";

import { Field, Form, Validation, Validations } from "@ehealth/components";
import Button from "../../../components/Button";

import styles from "./styles.module.css";

const InviteAcceptForm = ({
  handleSubmit,
  onSubmit = () => {},
  submitting
}) => (
  <Form className={styles.main} onSubmit={handleSubmit(onSubmit)}>
    <div>
      <Field.Checkbox
        label="Погоджуюсь з Регламентом функціонування системи eHealth"
        name="confirm"
      />
      <Validation.Required field="confirm" message="Об'язкове поле" />
    </div>
    <div>
      <Button disabled={submitting} type="submit" color="blue">
        прийняти запрошення
      </Button>
    </div>
  </Form>
);

export default reduxForm({
  form: "invite-accept-form",
  validate: reduxFormValidate({
    confirm: {
      required: true
    }
  })
})(InviteAcceptForm);
