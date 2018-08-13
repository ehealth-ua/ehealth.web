import React from "react";
import { compose } from "redux";

import { withRouter } from "react-router";
import Helmet from "react-helmet";

import {
  REACT_APP_OAUTH_URL,
  REACT_APP_SCOPES,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "../../../env";

import styles from "./styles.module.css";

class SignInPage extends React.Component {
  render() {
    const { location: { query } } = this.props;

    return (
      <section className={styles.main} id="sign-in-page">
        <Helmet
          title="Вхід"
          meta={[{ property: "og:title", content: "Вхід" }]}
        />

        <div className={styles.main__content}>
          <header className={styles.header}>
            <img src="/images/nhs-logo.svg" alt="Logo" />
          </header>
          {query.error && (
            <section className={styles.error}>Помилка отримання токена</section>
          )}
          <article className={styles.form}>
            <a
              className={styles.button}
              href={`${REACT_APP_OAUTH_URL}?client_id=${REACT_APP_CLIENT_ID}&scope=${REACT_APP_SCOPES}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
            >
              Увійти за допомогою EHEALTH
            </a>
          </article>
        </div>
      </section>
    );
  }
}

export default compose(withRouter)(SignInPage);
