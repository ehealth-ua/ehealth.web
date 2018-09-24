import React from "react";
import { Router } from "@reach/router";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Persons from "./pages/Persons";
import Declarations from "./pages/Declarations";

const NotFound = () => <p>Sorry, nothing here</p>;

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <DataProvider>
        <Layout>
          <Router>
            <Home path="/" />
            <Persons path="persons/*" />
            <Declarations path="declarations/*" />
            <NotFound default />
          </Router>
        </Layout>
      </DataProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
