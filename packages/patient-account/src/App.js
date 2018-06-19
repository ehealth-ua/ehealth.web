import React from "react";
import { ThemeProvider } from "emotion-theming";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router } from "react-router-dom";

import "./globalStyles";
import client from "./client";
import theme from "./theme";
import Routes from "./Routes";

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
