import React, { createContext, Component } from "react";
import { ForceRedirect, Switch, Modal } from "@ehealth/components";
import Error from "./components/Error";
import env from "./env";

const { Provider, Consumer } = createContext(() => {});

export default class ErrorBoundary extends Component {
  static Consumer = Consumer;

  state = { error: null, blocking: false };

  componentDidCatch({ message }) {
    const error = { type: "CLIENT", message };
    this.setError({ error, blocking: true });
  }

  render() {
    const { error, blocking } = this.state;

    return (
      <Provider value={this.setError}>
        {error && (
          <Switch
            value={error.type}
            CLIENT={<Error.ClientError error={error} />}
            FORBIDDEN={<Error.Forbidden error={error} />}
            network={
              <>
                {blocking ? (
                  <Error.ClientError error={error} />
                ) : (
                  <Modal width={760} p={4} placement="center">
                    Щось пішло не так...
                    <br />
                    <br />
                    <pre>{error && error.message}</pre>
                  </Modal>
                )}
              </>
            }
            UNAUTHORIZED={
              <ForceRedirect
                to={`${env.REACT_APP_OAUTH_URL}?client_id=${
                  env.REACT_APP_CLIENT_ID
                }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`}
              />
            }
            NOT_FOUND={<Error.NotFound error={error} />}
            INTERNAL_SERVER_ERROR={<Error.ServerError error={error} />}
            CONFLICT={<Error.ConflictError error={error} />}
            UNPROCESSABLE_ENTITY={<Error.UnprocessableEntity error={error} />}
            default={<Error.Default error={error} />}
          />
        )}
        {(error && blocking) || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, blocking }) => {
    this.setState({ error, blocking });

    if (!blocking) {
      setTimeout(() => this.setState({ error: null }), 8000);
    }
  };
}
