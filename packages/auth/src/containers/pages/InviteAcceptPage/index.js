import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1 } from "../../../components/Title";
import Points from "../../../components/Points";
import InviteAcceptForm from "../../forms/InviteAcceptForm";
import { getRequestById } from "../../../reducers";

import { onSubmit, onReject } from "./redux";
import styles from "./styles.module.css";

const SignUpStep2Page = ({ onSubmit, onReject, request: { id } }) => (
  <section className={styles.main} id="sign-up-page">
    <header className={styles.header}>
      <H1>ПОРЯДОК РОБОТИ СИСТЕМ</H1>

      <Points count={2} active={1} />
    </header>
    <article className={styles.content}>
      <p>
        Приймаючи запрошення на роботу в Електронній системі охорони здоров’я я
        підтверджую, що ознайомився з <br />
        <a
          rel="noopener noreferrer"
          target="__blank"
          href="https://zakon.rada.gov.ua/laws/show/411-2018-%D0%BF"
        >
          Порядком функціонування Електронної системи охорони здоров’я
        </a>
      </p>

      <div className={styles.form}>
        <InviteAcceptForm onSubmit={() => onSubmit(id)} />
      </div>
      <div className={styles.reject}>
        <button onClick={() => onReject(id)}>Відхилити запрошення</button>
      </div>
    </article>
  </section>
);

export default compose(
  withRouter,
  connect(
    state => ({
      request: getRequestById(state, state.pages.Invitelayout.request)
    }),
    { onSubmit, onReject }
  )
)(SignUpStep2Page);
