import React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router } from "react-router-dom";

import "./globalStyles";
import client from "./client";
import Routes from "./Routes";

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Routes />
    </Router>
  </ApolloProvider>
);

export default App;
