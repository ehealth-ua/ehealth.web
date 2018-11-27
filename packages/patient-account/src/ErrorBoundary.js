import React, { createContext, Component } from "react";
import { ForceRedirect, Switch, Modal } from "@ehealth/components";
import Error from "./components/Error";
import { Text } from "rebass/emotion";

import env from "./env";

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
              forbidden={
                <>
                  <Modal width={760} px={76} py={32} placement="top" backdrop>
                    <Text color="red" fontSize="16" fontWeight="bold">
                      У вас немає доступу до даної операції
                    </Text>
                  </Modal>
                </>
              }
              network={
                <>
                  {blocking ? (
                    <Error.ClientError error={error} />
                  ) : (
                    <Modal width={760} p={4} placement="top">
                      Щось пішло не так...
                    </Modal>
                  )}
                </>
              }
              unauthorized={
                <ForceRedirect
                  to={`${env.REACT_APP_OAUTH_URL}?client_id=${
                    env.REACT_APP_CLIENT_ID
                  }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`}
                />
              }
              not_found={<Error.NotFound />}
              internal_server_error={<Error.ServerError />}
              conflict={<Error.ConflictError />}
            />
          </>
        )}
        {(error && blocking) || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, blocking }) => {
    this.setState({ error, blocking });

    if (!blocking) {
      setTimeout(() => this.setState({ error: null }), 2000);
    }
  };
}
