import React from "react";
import { Router } from "@reach/router";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import ContractRequests from "./pages/ContractRequests";
import LegalEntityMergeJobs from "./pages/LegalEntityMergeJobs";
import Persons from "./pages/Persons";
import Declarations from "./pages/Declarations";
import LegalEntities from "./pages/LegalEntities";

const NotFound = () => <p>Sorry, nothing here</p>;

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <DataProvider>
        <Layout>
          <Router>
            <Home path="/" />
            <ContractRequests path="contract-requests/*" />
            <LegalEntityMergeJobs path="legal-entity-merge-jobs/*" />
            <Persons path="persons/*" />
            <Declarations path="declarations/*" />
            <LegalEntities path="legal-entities/*" />
            <NotFound default />
          </Router>
        </Layout>
      </DataProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
