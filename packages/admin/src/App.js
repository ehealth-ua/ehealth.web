import React from "react";
import { Router } from "@reach/router";
import { I18nProvider } from "@lingui/react";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import ContractRequests from "./pages/ContractRequests";
import Contracts from "./pages/Contracts";
import LegalEntityMergeJobs from "./pages/LegalEntityMergeJobs";
import Persons from "./pages/Persons";
import Declarations from "./pages/Declarations";
import LegalEntities from "./pages/LegalEntities";
import Dictionaries from "./pages/Dictionaries";

import locale from "./locales/uk/messages";

const catalogs = { cs: locale };

const NotFound = () => <p>Sorry, nothing here</p>;

const App = () => (
  <I18nProvider language="uk" catalogs={catalogs}>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <DataProvider>
          <Layout>
            <Router>
              <Home path="/" />
              <ContractRequests path="contract-requests/*" />
              <Contracts path="contracts/*" />
              <LegalEntityMergeJobs path="legal-entity-merge-jobs/*" />
              <Persons path="persons/*" />
              <Declarations path="declarations/*" />
              <LegalEntities path="legal-entities/*" />
              <Dictionaries path="dictionaries/*" />
              <NotFound default />
            </Router>
          </Layout>
        </DataProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </I18nProvider>
);

export default App;
