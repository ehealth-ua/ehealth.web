import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { provideHooks } from "redial";

import Button from "../../../components/Button";
import DictionaryValue from "../../../components/DictionaryValue";
import { fetchClientById } from "../../../redux/clients";
import { authorize } from "../../../redux/auth";
import { fetchDictionaries } from "../../../redux/dictionaries";

import { getClientById, getUser } from "../../../reducers";

import { fetchScope } from "./redux";
import styles from "./styles.module.css";

class AcceptPage extends Component {
  state = {
    isLoading: false,
    error: null
  };

  render() {
    const {
      client,
      user,
      scope,
      location: {
        query: { client_id, redirect_uri }
      }
    } = this.props;
    if (!client_id) return this.renderNotFoundClientId();
    if (!client) return this.renderNotFoundClient();
    if (!scope) return this.renderNotFoundScope();
    if (scope === "cabinet") return this.approval("cabinet");
    if (scope === "empty_roles") return this.renderNotFoundClientRole();
    if (!redirect_uri) return this.renderNotFoundRedirectUri();

    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          Ви даєте доступ додатку <b>{client.name}</b> на наступні дії:
          <ul className={styles.list}>
            {scope.split(" ").map(i => (
              <li key={i} className={styles.listItem}>
                • <DictionaryValue dictionary="SCOPES" value={i} />
              </li>
            ))}
          </ul>
        </header>
        <article className={styles.content}>
          <p>{user.email}</p>
        </article>
        {this.state.error && (
          <article className={styles.error}>
            <b>Помилка:</b>
            {this.state.error.map(
              i =>
                typeof i.value === "string" && (
                  <div key={i.key}>
                    {i.value} ({i.key})
                  </div>
                )
            )}
          </article>
        )}
        <footer className={styles.footer}>
          <div>
            <Button
              disabled={this.state.isLoading}
              onClick={() => this.approval()}
              color="blue"
            >
              прийняти та продовжити
            </Button>
          </div>
          <div className={styles.links}>
            <div>
              <Button
                rel="noopener noreferrer"
                target="__blank"
                to="https://ti-ukraine.org/publication/rehlament-funktsionuvannia-pilotnoho-proektu-elektronnoi-systemy-okhorony-zdorov-ia/"
                theme="link"
              >
                Угода користувача
              </Button>
            </div>
            <div>
              <Button
                rel="noopener noreferrer"
                target="__blank"
                to="https://ti-ukraine.org/publication/rehlament-funktsionuvannia-pilotnoho-proektu-elektronnoi-systemy-okhorony-zdorov-ia/"
                theme="link"
              >
                Умови використання
              </Button>
            </div>
          </div>
        </footer>
      </section>
    );
  }

  approval(_scope) {
    let {
      location: { query },
      scope
    } = this.props;
    if (_scope === "cabinet") scope = "";
    this.setState({ isLoading: true });

    this.props
      .authorize({
        clientId: query.client_id,
        scope,
        redirectUri: query.redirect_uri
      })
      .then(({ payload, error }) => {
        if (error) {
          return this.setState({
            error: Object.entries(payload.response.error).map(
              ([key, value]) => ({
                key,
                value
              })
            ),
            isLoading: false
          });
        }
        this.setState({
          isLoading: false,
          error: null
        });
        return window && (window.location = payload.headers.get("location"));
      });
  }

  renderNotFoundClientId() {
    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          <b>Помилка</b>
        </header>
        <article className={styles.content}>
          <p>Не вказан идентифікатор додатку для авторизації</p>
        </article>
      </section>
    );
  }
  renderNotFoundClientRole() {
    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          <b>Помилка</b>
        </header>
        <article className={styles.content}>
          <p>У даного користувача не має доступу</p>
        </article>
      </section>
    );
  }

  renderNotFoundClient() {
    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          <b>Помилка</b>
        </header>
        <article className={styles.content}>
          <p>Не знайдено додаток за вказанним ідентифікатором</p>
        </article>
      </section>
    );
  }
  renderNotFoundScope() {
    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          <b>Помилка</b>
        </header>
        <article className={styles.content}>
          <p>Не вказані параметри доступу до данних</p>
        </article>
      </section>
    );
  }

  renderNotFoundRedirectUri() {
    return (
      <section className={styles.main} id="accept-page">
        <header className={styles.header}>
          <b>Помилка</b>
        </header>
        <article className={styles.content}>
          <p>Не вказано адресу зворотнього визову</p>
        </article>
      </section>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      Promise.all([
        dispatch(fetchDictionaries({ name: "SCOPES" })),
        dispatch(fetchClientById(query.client_id)),
        dispatch(fetchScope(query.client_id))
      ])
  }),
  withRouter,
  connect(
    (state, { location: { query } }) => ({
      scope: query.scope || state.pages.AcceptPage.scope,
      client: getClientById(state, query.client_id),
      user: getUser(state)
    }),
    { authorize }
  )
)(AcceptPage);
