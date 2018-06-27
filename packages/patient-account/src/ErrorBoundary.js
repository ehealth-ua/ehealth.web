import React, { createContext, Component } from "react";

const { Provider, Consumer } = createContext(() => {});

export default class ErrorBoundary extends Component {
  static Consumer = Consumer;

  state = { error: null, blocking: false };

  componentDidCatch(error, info) {
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
          </>
        )}
        {(error && blocking) || this.props.children}
      </Provider>
    );
  }

  setError = ({ error, blocking }) => this.setState({ error, blocking });
}
