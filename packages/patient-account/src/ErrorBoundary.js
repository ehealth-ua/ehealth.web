import React, { createContext, Component } from "react";
import {
  ForceRedirect,
  Switch,
  Modal,
  SelfDistract
} from "@ehealth/components";
import Error from "./components/Error";
import { Text } from "rebass/emotion";
import {
  REACT_APP_OAUTH_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "./env";

const { Provider, Consumer } = createContext(() => {});

class DelayedComponent extends React.Component {
  componentDidMount() {
    const { onDismiss, delayTime } = this.props;
    setTimeout(() => onDismiss(), delayTime);
  }
  render() {
    return (
      <Modal width={760} px={76} py={32} place="top" backdrop>
        <Text color="red" fontSize="16" fontWeight="bold">
          У вас немає доступу до даної операції
        </Text>
      </Modal>
    );
  }
}

export default class ErrorBoundary extends Component {
  static Consumer = Consumer;

  state = { error: null, blocking: false };

  componentDidCatch({ message }, info) {
    const error = { type: "client", message };

    this.setError({ error, blocking: true });
  }
  onDismiss = () => {
    this.setState({ error: null });
  };

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
                <DelayedComponent delayTime={2000} onDismiss={this.onDismiss} />
              }
              network={
                <>
                  {blocking ? (
                    <Error.Client error={error} />
                  ) : (
                    <Modal width={760} p={4} place="top">
                      Щось пішло не так...
                    </Modal>
                  )}
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
