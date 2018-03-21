import React from "react";
import { withRouter } from "react-router";

import { H1 } from "../../../components/Title";

import styles from "./styles.module.css";

const InviteRejectPage = () => (
  <section className={styles.main} id="invite-reject-page">
    <H1>
      Вітаємо! <br />
      Запрошення відхилине
    </H1>
  </section>
);

export default withRouter(InviteRejectPage);
