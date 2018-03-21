import React from "react";

import { H1 } from "../../../components/Title";

import styles from "./styles.module.css";

const NotFoundPage = () => (
  <div className={styles.error} id="not-found-page">
    <H1>ПОМИЛКА</H1>

    <div className={styles.code}>404</div>

    <H1 tag="h2">От халепа! Сторінки, що ви шукаєте тут немає</H1>

    <footer className={styles.footer}>
      При виникненні питань, будь ласка, зверніться в <br />
      <a href="mailto:support@test.com">службу підтримки</a>
    </footer>
  </div>
);

export default NotFoundPage;
