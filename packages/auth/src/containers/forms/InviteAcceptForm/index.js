import React from "react";
import { Field, Form, Validation } from "@ehealth/components";

import styles from "./styles.module.css";

const InviteAcceptForm = ({ onSubmit }) => (
  <Form className={styles.main} onSubmit={onSubmit}>
    <div>
      <Field.Checkbox
        label="Зобов'язуюсь дотримуватись положень цього Порядку"
        name="confirm"
      />
      <Validation.Required field="confirm" message="Об'язкове поле" />
    </div>
    <div>
      <Form.Submit color="blue" block>
        прийняти запрошення
      </Form.Submit>
    </div>
  </Form>
);

export default InviteAcceptForm;
