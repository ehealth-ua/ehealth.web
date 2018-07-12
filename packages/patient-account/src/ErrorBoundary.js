import React, { createContext, Component } from "react";
import { ForceRedirect, Switch } from "@ehealth/components";
import Error from "./components/Error";
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
    const error = { type: "client", message };

    this.setError({ error, blocking: true });
  }

  render() {
    const { error, blocking } = this.state;

    return (
      <Provider value={this.setError}>
        {error && (
          <>
            <Switch
              value={error.type}
              client={<Error.ClientError error={error} />}
              network={
                <>
                  {/* add notification here for failed to fetch*/}
                  {this.props.children}
                </>
              }
              unauthorized={
                <ForceRedirect
                  to={`${REACT_APP_OAUTH_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                />
              }
              not_found={<Error.NotFound />}
              internal_server_error={<Error.ServerError />}
            />
          </>
        )}
        {(error && blocking) || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, blocking }) => this.setState({ error, blocking });
}