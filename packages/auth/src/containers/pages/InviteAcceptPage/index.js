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
      <H1>Прийняття Регламенту</H1>

      <Points count={2} active={1} />
    </header>
    <article className={styles.content}>
      <p>
        Приймаючи запрошення на роботу в системі eHealth ви також <br />
        погоджуєтесь з положеннями{" "}
        <a
          rel="noopener noreferrer"
          target="__blank"
          href="https://ti-ukraine.org/news/rehlament-funktsionuvannia-pilotnoho-proektu-elektronnoi-systemy-okhorony-zdorov-ia/"
        >
          Регламенту функціонування системи
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
