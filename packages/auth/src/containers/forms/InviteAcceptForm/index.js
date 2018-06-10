import React from "react";
import { Field, Form, Validation, Validations } from "@ehealth/components";
import Button from "../../../components/Button";

import styles from "./styles.module.css";

const InviteAcceptForm = ({ onSubmit, submitting }) => (
  <Form className={styles.main} onSubmit={onSubmit}>
    <div>
      <Field.Checkbox
        label="Погоджуюсь з Регламентом функціонування системи eHealth"
        name="confirm"
      />
      <Validation.Required field="confirm" message="Об'язкове поле" />
    </div>
    <div>
      <Form.Submit disabled={submitting} type="submit" color="blue" block>
        прийняти запрошення
      </Form.Submit>
    </div>
  </Form>
);

export default InviteAcceptForm;
