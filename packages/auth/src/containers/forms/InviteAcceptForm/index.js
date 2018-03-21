import React from "react";
import { reduxForm, Field } from "redux-form";
import { reduxFormValidate } from "react-nebo15-validate";

import FieldCheckbox from "../../../components/reduxForm/FieldCheckbox";
import Button from "../../../components/Button";

import styles from "./styles.module.css";

const InviteAcceptForm = ({
  handleSubmit,
  onSubmit = () => {},
  submitting
}) => (
  <form className={styles.main} onSubmit={handleSubmit(onSubmit)}>
    <div>
      <Field
        labelText="Погоджуюсь з Регламентом функціонування системи eHealth"
        type="checkbox"
        name="confirm"
        component={FieldCheckbox}
      />
    </div>
    <div>
      <Button disabled={submitting} type="submit" color="blue">
        прийняти запрошення
      </Button>
    </div>
  </form>
);

export default reduxForm({
  form: "invite-accept-form",
  validate: reduxFormValidate({
    confirm: {
      required: true
    }
  })
})(InviteAcceptForm);
