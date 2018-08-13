import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Router,
  Route,
  IndexRedirect,
  IndexRoute,
  browserHistory,
  applyRouterMiddleware
} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { useRedial } from "react-router-redial";

import { logout, getToken, verifyToken } from "./redux/session";
import { fetchUserData } from "./redux/user";
import { REACT_APP_PUBLIC_INDEX_ROUTE } from "./env";

import App from "./containers/layouts/App";
import Main from "./containers/layouts/Main";
import PreloadData from "./containers/layouts/PreloadData";

import SignInPage from "./containers/pages/SignInPage";

import DashboardPage from "./containers/pages/DashboardPage";

import DictionariesPage from "./containers/pages/DictionariesPage";
import DictionaryPage from "./containers/pages/DictionaryPage";

import ClinicsListPage from "./containers/pages/ClinicsListPage";
import ClinicsSearchPage from "./containers/pages/ClinicsSearchPage";
import ClinicsVerificationListPage from "./containers/pages/ClinicsVerificationListPage";
import ClinicDetailPage from "./containers/pages/ClinicDetailPage";

import DeclarationsListPage from "./containers/pages/DeclarationsListPage";
import DeclarationDetailPage from "./containers/pages/DeclarationDetailPage";
import PendingDeclarationsListPage from "./containers/pages/PendingDeclarationsListPage";
import PendingDeclarationDetailPage from "./containers/pages/PendingDeclarationDetailPage";

import EmployeesListPage from "./containers/pages/EmployeesListPage";
import EmployeeDetailPage from "./containers/pages/EmployeeDetailPage";
import PendingEmployeesListPage from "./containers/pages/PendingEmployeesListPage";
import PendingEmployeeDetailPage from "./containers/pages/PendingEmployeeDetailPage";

import ReportsListPage from "./containers/pages/ReportsListPage";

import SystemConfigurationPage from "./containers/pages/SystemConfigurationPage";

import InnmsListPage from "./containers/pages/InnmsListPage";
import InnmCreatePage from "./containers/pages/InnmCreatePage";
import InnmDetailPage from "./containers/pages/InnmDetailPage";

import InnmDosagesListPage from "./containers/pages/InnmDosagesListPage";
import InnmDosagesCreatePage from "./containers/pages/InnmDosagesCreatePage";
import InnmDosagesDetailPage from "./containers/pages/InnmDosagesDetailPage";

import MedicationsListPage from "./containers/pages/MedicationsListPage";
import MedicationCreatePage from "./containers/pages/MedicationCreatePage";
import MedicationDetailPage from "./containers/pages/MedicationDetailPage";

import ContractsListPage from "./containers/pages/ContractsListPage";
import ContractsDetailsPage from "./containers/pages/ContractsDetailsPage";
import ContractRequestsListPage from "./containers/pages/ContractRequestsListPage";
import ContractRequestsDetailsPage from "./containers/pages/ContractRequestsDetailsPage";
import DivisionEmployeesPage from "./containers/pages/DivisionEmployeesPage";

import MedicalProgramsListPage from "./containers/pages/MedicalProgramsListPage";
import MedicalProgramCreatePage from "./containers/pages/MedicalProgramCreatePage";
import MedicalProgramDetailPage from "./containers/pages/MedicalProgramDetailPage";

import ProgramMedicationsListPage from "./containers/pages/ProgramMedicationsListPage";
import ProgramMedicationDetailPage from "./containers/pages/ProgramMedicationDetailPage";
import ProgramMedicationUpdatePage from "./containers/pages/ProgramMedicationUpdatePage";
import ProgramMedicationCreatePage from "./containers/pages/ProgramMedicationCreatePage";

import MedicationRequestsListPage from "./containers/pages/MedicationRequestsListPage";
import MedicationRequestDetailPage from "./containers/pages/MedicationRequestDetailPage";

import MedicationDispensesListPage from "./containers/pages/MedicationDispensesListPage";
import MedicationDispenseDetailPage from "./containers/pages/MedicationDispenseDetailPage";

import BlackUsersListPage from "./containers/pages/BlackUsersListPage";
import BlackListUserDetailPage from "./containers/pages/BlackListUserDetailPage";
import BlackUserCreatePage from "./containers/pages/BlackUserCreatePage";

import PartyUsersListPage from "./containers/pages/PartyUsersListPage";

import ResetAuthenticationMethodPage from "./containers/pages/ResetAuthenticationMethodPage";

import PersonSearchPage from "./containers/pages/PersonSearchPage";

import RegistersPage from "./containers/pages/RegistersPage";
import RegisterUploadPage from "./containers/pages/RegisterUploadPage";
import RegistersEntriesPage from "./containers/pages/RegistersEntriesPage";
import RegistersErrorsPage from "./containers/pages/RegistersErrorsPage";

import NotFoundPage from "./containers/pages/NotFoundPage";
import AccessDeniedPage from "./containers/pages/AccessDeniedPage";

import ReimbursementReportPage from "./containers/pages/ReimbursementReport/index";
import InternalErrorPage from "./containers/pages/InternalErrorPage/index";

import { showLoading, hideLoading } from "./redux/loading";
import { hasScope } from "./helpers/scope";
import { isAuthorized, getScope } from "./reducers";
import { getCookie } from "@ehealth/utils";

export default class Routes extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.context;
    const { dispatch, getState } = store;

    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Router
        history={history}
        render={applyRouterMiddleware(
          useRedial({
            locals: { dispatch, getState },
            beforeTransition: ["fetch"],
            afterTransition: ["defer", "done"],
            parallel: true,
            initialLoading: () => null,
            onStarted: () => {
              dispatch(showLoading());
            },
            onCompleted: transition => {
              dispatch([hideLoading()]);
              if (transition === "beforeTransition") {
                window.scrollTo(0, 0);
              }
            },
            onAborted: () => {
              dispatch(hideLoading());
            },
            onError: () => {
              dispatch(hideLoading());
            }
          })
        )}
      >
        <Route component={App}>
          <Route component={Main}>
            <Route path="/" component={PreloadData}>
              <IndexRedirect to="dashboard" />
              <Route path="dashboard" component={DashboardPage} />
              <Route path="dictionaries">
                <IndexRoute component={DictionariesPage} />
                <Route path=":name" component={DictionaryPage} />
              </Route>
              <Route path="persons">
                <IndexRoute component={PersonSearchPage} />
              </Route>
              <Route
                path="clinics"
                onEnter={this.requireScope(["legal_entity:read"])}
              >
                <IndexRoute component={ClinicsListPage} />
                <Route path=":id" component={ClinicDetailPage} />
              </Route>
              <Route
                path="clinics-verification"
                onEnter={this.requireScope(["legal_entity:read"])}
              >
                <IndexRoute component={ClinicsSearchPage} />
                <Route path="list" component={ClinicsVerificationListPage} />
              </Route>
              <Route
                path="declarations"
                onEnter={this.requireScope(["declaration:read"])}
              >
                <IndexRoute component={DeclarationsListPage} />
                <Route path=":id" component={DeclarationDetailPage} />
              </Route>
              <Route
                path="pending-declarations"
                onEnter={this.requireScope(["declaration:read"])}
              >
                <IndexRoute component={PendingDeclarationsListPage} />
                <Route path=":id" component={PendingDeclarationDetailPage} />
              </Route>
              <Route
                path="employees"
                onEnter={this.requireScope(["employee:read"])}
              >
                <IndexRoute component={EmployeesListPage} />
                <Route path=":id" component={EmployeeDetailPage} />
              </Route>
              <Route
                path="pending-employees"
                onEnter={this.requireScope(["employee_request:read"])}
              >
                <IndexRoute component={PendingEmployeesListPage} />
                <Route path=":id" component={PendingEmployeeDetailPage} />
              </Route>
              <Route path="innms" onEnter={this.requireScope(["innm:read"])}>
                <IndexRoute component={InnmsListPage} />
                <Route path="create" component={InnmCreatePage} />
                <Route path=":id" component={InnmDetailPage} />
              </Route>
              <Route
                path="innm-dosages"
                onEnter={this.requireScope(["innm_dosage:read"])}
              >
                <IndexRoute component={InnmDosagesListPage} />
                <Route path="create" component={InnmDosagesCreatePage} />
                <Route path=":id" component={InnmDosagesDetailPage} />
              </Route>
              <Route
                path="medications"
                onEnter={this.requireScope(["medication:read"])}
              >
                <IndexRoute component={MedicationsListPage} />
                <Route path="create" component={MedicationCreatePage} />
                <Route path=":id" component={MedicationDetailPage} />
              </Route>
              <Route
                path="medication-requests"
                onEnter={this.requireScope(["medication_request:read"])}
              >
                <IndexRoute component={MedicationRequestsListPage} />
                <Route path=":id" component={MedicationRequestDetailPage} />
              </Route>
              <Route
                path="medication-dispenses"
                onEnter={this.requireScope(["medication_dispense:read"])}
              >
                <IndexRoute component={MedicationDispensesListPage} />
                <Route path=":id" component={MedicationDispenseDetailPage} />
              </Route>
              <Route
                path="reimbursement-report"
                onEnter={this.requireScope(["reimbursement_report:download"])}
              >
                <IndexRoute component={ReimbursementReportPage} />
              </Route>
              <Route
                path="medical-programs"
                onEnter={this.requireScope(["medical_program:read"])}
              >
                <IndexRoute component={MedicalProgramsListPage} />
                <Route path="create" component={MedicalProgramCreatePage} />
                <Route path=":id" component={MedicalProgramDetailPage} />
              </Route>
              <Route
                path="contracts"
                onEnter={this.requireScope(["contract:read"])}
              >
                <IndexRoute component={ContractsListPage} />
                <Route path=":id" component={ContractsDetailsPage} />
              </Route>
              <Route
                path="contract-requests"
                onEnter={this.requireScope(["contract_request:read"])}
              >
                <IndexRoute component={ContractRequestsListPage} />
                <Route path=":id" component={ContractRequestsDetailsPage} />
              </Route>
              <Route
                path="contract-requests/:id/division-employees/:divisionId"
                component={DivisionEmployeesPage}
              />
              <Route
                path="program-medications"
                onEnter={this.requireScope(["program_medication:read"])}
              >
                <IndexRoute component={ProgramMedicationsListPage} />
                <Route
                  path="create"
                  onEnter={this.requireScope(["program_medication:write"])}
                  component={ProgramMedicationCreatePage}
                />
                <Route
                  path=":id/update"
                  component={ProgramMedicationUpdatePage}
                />
                <Route path=":id" component={ProgramMedicationDetailPage} />
              </Route>

              <Route
                path="party-users"
                onEnter={this.requireScope(["party_user:read"])}
              >
                <IndexRoute component={PartyUsersListPage} />
              </Route>
              <Route
                path="black-list-users"
                onEnter={this.requireScope(["bl_user:read"])}
              >
                <IndexRoute component={BlackUsersListPage} />
                <Route path="create" component={BlackUserCreatePage} />
                <Route path=":id" component={BlackListUserDetailPage} />
              </Route>
              <Route
                path="configuration"
                component={SystemConfigurationPage}
                onEnter={this.requireScope(["global_parameters:read"])}
              />
              <Route
                path="registers"
                onEnter={this.requireScope(["register:read"])}
              >
                <IndexRoute component={RegistersPage} />
                <Route path="upload" component={RegisterUploadPage} />
                <Route path=":id" component={RegistersErrorsPage} />
              </Route>
              <Route
                path="registers-entries"
                component={RegistersEntriesPage}
              />
              <Route path="reports" component={ReportsListPage} />
              <Route
                path="reset-authentication-method"
                onEnter={this.requireScope([
                  "person:reset_authentication_method"
                ])}
                component={ResetAuthenticationMethodPage}
              />
            </Route>
            <Route path="401" component={AccessDeniedPage} />
          </Route>
          <Route path="sign-in" component={SignInPage} />
          <Route path="internal-error" component={InternalErrorPage} />
          <Route path="*" component={NotFoundPage} />
        </Route>
      </Router>
    );
  }

  requireScope = requiredScope => (nextState, replace, next) => {
    const availableScope = JSON.parse(getCookie("meta")).scope;

    if (!hasScope(requiredScope, availableScope)) {
      replace({ pathname: "/401" });
    }
    return next();
  };
}
