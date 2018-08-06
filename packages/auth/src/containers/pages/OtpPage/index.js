import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1 } from "../../../components/Title";
import OtpForm from "../../forms/OtpForm";
import Button from "../../../components/Button";

import { onSubmit, onResend } from "./redux";
import styles from "./styles.module.css";

const OtpPage = ({
  onSubmit = () => {},
  onResend = () => {},
  router,
  location: { search }
}) => (
  <section className={styles.main} id="otp-page">
    <header className={styles.header}>
      <H1>Вхід у систему eHealth</H1>
    </header>
    <article className={styles.form}>
      <OtpForm onSubmit={onSubmit} onResend={onResend} repeat />
      <Button theme="link" to={`/update-factor/${search}`}>
        Змінити додатковий фактор авторизації
      </Button>
    </article>
  </section>
);

export default compose(withRouter, connect(null, { onSubmit, onResend }))(
  OtpPage
);
