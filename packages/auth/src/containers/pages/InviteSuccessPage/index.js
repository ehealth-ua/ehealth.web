import React from "react";
import { withRouter } from "react-router";

import { H1 } from "../../../components/Title";

import styles from "./styles.module.css";

const InviteSuccessPage = () => (
  <section className={styles.main} id="invite-success-page">
    <H1>
      Вітаємо! <br />
      Запрошення прийняте
    </H1>
  </section>
);

export default withRouter(InviteSuccessPage);
