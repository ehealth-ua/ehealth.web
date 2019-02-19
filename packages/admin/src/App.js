import React from "react";
import { Router } from "@reach/router";
import { I18nProvider } from "@lingui/react";
import { ThemeProvider } from "@ehealth/components";

import GlobalStyles from "./components/GlobalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";
import Preload from "./Preload";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import ContractRequests from "./pages/ContractRequests";
import Contracts from "./pages/Contracts";
import LegalEntityMergeJobs from "./pages/LegalEntityMergeJobs";
import LegalEntityDeactivateJobs from "./pages/LegalEntityDeactivateJobs";
import Persons from "./pages/Persons";
import PatientMergeRequests from "./pages/PatientMergeRequests";
import Declarations from "./pages/Declarations";
import PendingDeclarations from "./pages/PendingDeclarations";
import LegalEntities from "./pages/LegalEntities";
import MedicalPrograms from "./pages/MedicalPrograms";
import Dictionaries from "./pages/Dictionaries";

import localeUK from "./locales/uk/messages.js";

const catalogs = { uk: localeUK };

const NotFound = () => <p>Sorry, nothing here</p>;

const App = () => (
  <I18nProvider language="uk" catalogs={catalogs}>
    <GlobalStyles />

    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <DataProvider>
          <Preload>
            <Layout>
              <Router>
                <Home path="/" />
                <ContractRequests path="contract-requests/*" />
                <Contracts path="contracts/*" />
                <LegalEntityMergeJobs path="legal-entity-merge-jobs/*" />
                <LegalEntityDeactivateJobs path="legal-entity-deactivate-jobs/*" />
                <Persons path="persons/*" />
                <PatientMergeRequests path="patient-merge-requests/*" />
                <Declarations path="declarations/*" />
                <PendingDeclarations path="pending-declarations/*" />
                <LegalEntities path="legal-entities/*" />
                <MedicalPrograms path="medical-programs/*" />
                <Dictionaries path="dictionaries/*" />
                <NotFound default />
              </Router>
            </Layout>
          </Preload>
        </DataProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </I18nProvider>
);

export default App;
