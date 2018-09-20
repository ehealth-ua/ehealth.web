import React from "react";
import { Router } from "@reach/router";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import Declarations from "./pages/Declarations";

const NotFound = () => <p>Sorry, nothing here</p>;

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <DataProvider>
        <Layout>
          <Router>
            <HomePage path="/" />
            <PatientsPage path="patients/*" />
            <Declarations path="declarations/*" />
            <NotFound default />
          </Router>
        </Layout>
      </DataProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
