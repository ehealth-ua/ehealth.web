import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";

import ErrorBoundary from "./ErrorBoundary";
import { createClient } from "./client";

class DataProvider extends Component {
  client = createClient({ onError: this.props.onError });

  render() {
    return (
      <ApolloProvider client={this.client}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default props => (
  <ErrorBoundary.Consumer>
    {setError => <DataProvider {...props} onError={setError} />}
  </ErrorBoundary.Consumer>
);
