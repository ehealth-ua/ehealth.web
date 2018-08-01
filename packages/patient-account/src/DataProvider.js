import React, { Component } from "react";
import { ApolloProvider, getDataFromTree } from "react-apollo";

import ErrorBoundary from "./ErrorBoundary";
import { createClient } from "./client";

class DataProvider extends Component {
  state = {
    loading: true
  };

  client = createClient({ onError: this.props.onError });

  async componentDidMount() {
    await getDataFromTree(<ApolloProvider {...this.providerProps} />);

    this.setState({ loading: false });
  }

  render() {
    return this.state.loading ? null : (
      <ApolloProvider {...this.providerProps} />
    );
  }

  get providerProps() {
    const { client } = this;
    const { children } = this.props;
    console.log(client);
    return { client, children };
  }
}

export default props => (
  <ErrorBoundary.Consumer>
    {setError => <DataProvider {...props} onError={setError} />}
  </ErrorBoundary.Consumer>
);
