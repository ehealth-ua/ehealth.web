import React, { createContext, Component } from "react";
import Cookie from "js-cookie";
import * as Sentry from "@sentry/browser";

import env from "./env";
import Error from "./components/Error";

const { Provider, Consumer } = createContext(() => {});

export default class ErrorBoundary extends Component {
  static Consumer = Consumer;

  state = { error: null, blocking: false };

  componentDidMount() {
    const meta = Cookie.getJSON("meta");

    if (meta) {
      Sentry.configureScope(scope => {
        scope.setUser({ id: meta.userId });
      });
    }
  }

  componentDidCatch(error, info) {
    switch (error.name) {
      case "GraphQLError":
      case "NetworkError":
        return this.setError({ error, info, blocking: true });
      default:
        return this.setState({ blocking: true });
    }
  }

  render() {
    const { error, blocking } = this.state;

    return (
      <Provider value={this.setError}>
        {error && (
          <Error error={error} blocking={blocking} onClose={this.onClose} />
        )}
        {blocking || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, info, blocking }) => {
    // TODO: This logic should be reconsidered when we will receive unauthenticated errors in GraphQL error format
    if (error.name === "NetworkError" && error.statusCode === 401) {
      const authUrl = `${env.REACT_APP_OAUTH_URL}?client_id=${
        env.REACT_APP_CLIENT_ID
      }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`;
      window.location.replace(authUrl);
      return;
    }

    this.setState({ error, blocking });

    Sentry.withScope(scope => {
      if (info) {
        Object.keys(info).forEach(key => scope.setExtra(key, info[key]));
      }

      Sentry.captureException(error);
    });
  };

  onClose = () => {
    this.setState({ error: null, blocking: false });
  };
}
