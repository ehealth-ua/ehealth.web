import React, { createContext, Component } from "react";
import { ForceRedirect, Switch } from "@ehealth/components";

import {
  REACT_APP_OAUTH_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "./env";

const { Provider, Consumer } = createContext(() => {});

export default class ErrorBoundary extends Component {
  static Consumer = Consumer;

  state = { error: null, blocking: false };

  componentDidCatch({ message }, info) {
    const error = { type: "internal", message };

    this.setError({ error, blocking: true });
  }

  render() {
    const { error, blocking } = this.state;

    return (
      <Provider value={this.setError}>
        {error && (
          <>
            Something went wrong
            <pre>{JSON.stringify(error, null, 2)}</pre>
            <Switch
              value={error.type}
              access_denied={
                <ForceRedirect
                  to={`${REACT_APP_OAUTH_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                />
              }
            />
          </>
        )}
        {(error && blocking) || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, blocking }) => this.setState({ error, blocking });
}
