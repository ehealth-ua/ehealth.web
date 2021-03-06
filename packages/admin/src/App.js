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
import ProgramMedications from "./pages/ProgramMedications";
import Dictionaries from "./pages/Dictionaries";
import INNMs from "./pages/INNMs";
import INNMDosages from "./pages/INNMDosages";
import Medications from "./pages/Medications";
import Employees from "./pages/Employees";
import EmployeeRequests from "./pages/EmployeeRequests";
import Services from "./pages/Services";
import ServiceGroups from "./pages/ServiceGroups";
import ProgramServices from "./pages/ProgramServices";
import ResetPersonsAuthMethod from "./pages/ResetPersonsAuthMethod";
import ResetPersonsAuthMethodJobs from "./pages/ResetPersonsAuthMethodJobs";

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
                <ResetPersonsAuthMethodJobs path="reset-persons-auth-method-jobs/*" />
                <Persons path="persons/*" />
                <ResetPersonsAuthMethod path="reset-authentication-method/*" />
                <PatientMergeRequests path="patient-merge-requests/*" />
                <Declarations path="declarations/*" />
                <PendingDeclarations path="pending-declarations/*" />
                <LegalEntities path="legal-entities/*" />
                <INNMs path="innms/*" />
                <INNMDosages path="innm-dosages/*" />
                <Medications path="medications/*" />
                <Employees path="employees/*" />
                <EmployeeRequests path="employee-requests/*" />
                <MedicalPrograms path="medical-programs/*" />
                <ProgramMedications path="program-medications/*" />
                <Dictionaries path="dictionaries/*" />
                <Services path="services/*" />
                <ServiceGroups path="service-groups/*" />
                <ProgramServices path="program-services/*" />
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
