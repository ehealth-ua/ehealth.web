import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import { H1 } from "../../../components/Title";
import { getRequestById } from "../../../reducers";

import { fetchRequestByHash } from "./redux";
import styles from "./styles.module.css";

class InviteLayout extends Component {
  get routeScopes() {
    return this.props.routes[this.props.routes.length - 1].inviteStatuses || [];
  }

  renderNotFound() {
    return (
      <section className={styles.main} id="invite-layout">
        <H1>
          Помилка! <br />
          Запрошення не знайдено
        </H1>
      </section>
    );
  }

  renderError() {
    return (
      <section className={styles.main} id="invite-layout">
        <H1>
          Помилка! <br />
          Запрошення вже використано
        </H1>
      </section>
    );
  }

  render() {
    const { request, children } = this.props;
    if (!request) return this.renderNotFound();
    if (this.routeScopes.indexOf(request.status) === -1)
      return this.renderError();
    return children;
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      query.invite && dispatch(fetchRequestByHash(query.invite))
  }),
  connect(state => ({
    request: getRequestById(state, state.pages.Invitelayout.request)
  }))
)(InviteLayout);
