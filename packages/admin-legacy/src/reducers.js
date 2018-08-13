import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import { routerReducer as routing } from "react-router-redux";
import { denormalize } from "normalizr";
import * as schemas from "./schemas";

import loading from "./redux/loading";

import labels from "./redux/labels";

import session from "./redux/session";
import error from "./redux/error";

import dictionaries from "./redux/dictionaries";
import clinics from "./redux/clinics";
import declarations from "./redux/declarations";
import contracts from "./redux/contracts";
import employees from "./redux/employees";
import employeesRequests from "./redux/employees-requests";
import black_list_users from "./redux/black-list-users";
import party_users from "./redux/party-users";
import registers from "./redux/registers";
import register_entries from "./redux/register-entries";
import capitation_reports from "./redux/capitation-reports";
import capitation_reports_list from "./redux/capitation-reports-list";

import {
  globalStat,
  detailStat,
  declarationsStat,
  reports
} from "./redux/dashboard";

import configuration from "./redux/configuration";
import innms from "./redux/innms";
import innm_dosages from "./redux/innm-dosages";
import medications from "./redux/medications";
import program_medications from "./redux/program-medications";
import medical_programs from "./redux/medical-programs";
import medication_requests from "./redux/medication-requests";
import medication_dispenses from "./redux/medication-dispenses";
import persons from "./redux/persons";

import Aside from "./containers/blocks/Aside/redux";

import DashboardPage from "./containers/pages/DashboardPage/redux";

import ClinicsListPage from "./containers/pages/ClinicsListPage/redux";
import ClinicDetailPage from "./containers/pages/ClinicDetailPage/redux";

import DeclarationsListPage from "./containers/pages/DeclarationsListPage/redux";
import DeclarationDetailPage from "./containers/pages/DeclarationDetailPage/redux";

import PendingDeclarationDetailPage from "./containers/pages/PendingDeclarationDetailPage/redux";
import PendingDeclarationsListPage from "./containers/pages/PendingDeclarationsListPage/redux";

import ContractsListPage from "./containers/pages/ContractsListPage/redux";
import ContractsDetailsPage from "./containers/pages/ContractsDetailsPage/redux";
import ContractRequestsListPage from "./containers/pages/ContractRequestsListPage/redux";
import ContractRequestsDetailsPage from "./containers/pages/ContractRequestsDetailsPage/redux";

import ReportsListPage from "./containers/pages/ReportsListPage/redux";

import EmployeesListPage from "./containers/pages/EmployeesListPage/redux";
import EmployeeDetailPage from "./containers/pages/EmployeeDetailPage/redux";
import PendingEmployeesListPage from "./containers/pages/PendingEmployeesListPage/redux";
import PendingEmployeeDetailPage from "./containers/pages/PendingEmployeeDetailPage/redux";

import InnmsListPage from "./containers/pages/InnmsListPage/redux";
import InnmDetailPage from "./containers/pages/InnmDetailPage/redux";

import InnmDosagesListPage from "./containers/pages/InnmDosagesListPage/redux";
import InnmDosagesDetailPage from "./containers/pages/InnmDosagesDetailPage/redux";
import InnmDosagesCreatePage from "./containers/pages/InnmDosagesCreatePage/redux";

import MedicationsListPage from "./containers/pages/MedicationsListPage/redux";
import MedicationDetailPage from "./containers/pages/MedicationDetailPage/redux";
import MedicationCreatePage from "./containers/pages/MedicationCreatePage/redux";

import MedicationRequestsListPage from "./containers/pages/MedicationRequestsListPage/redux";
import MedicationRequestDetailPage from "./containers/pages/MedicationRequestDetailPage/redux";

import MedicationDispensesListPage from "./containers/pages/MedicationDispensesListPage/redux";
import MedicationDispenseDetailPage from "./containers/pages/MedicationDispenseDetailPage/redux";

import MedicalProgramsListPage from "./containers/pages/MedicalProgramsListPage/redux";
import MedicalProgramDetailPage from "./containers/pages/MedicalProgramDetailPage/redux";

import ProgramMedicationsListPage from "./containers/pages/ProgramMedicationsListPage/redux";
import ProgramMedicationUpdatePage from "./containers/pages/ProgramMedicationUpdatePage/redux";
import ProgramMedicationDetailPage from "./containers/pages/ProgramMedicationDetailPage/redux";
import ProgramMedicationCreatePage from "./containers/pages/ProgramMedicationCreatePage/redux";

import BlackUsersListPage from "./containers/pages/BlackUsersListPage/redux";
import BlackListUserDetailPage from "./containers/pages/BlackListUserDetailPage/redux";

import PartyUsersListPage from "./containers/pages/PartyUsersListPage/redux";

import PersonSearchPage from "./containers/pages/PersonSearchPage/redux";
import RegistersPage from "./containers/pages/RegistersPage/redux";
import RegistersEntriesPage from "./containers/pages/RegistersEntriesPage/redux";

const blocks = combineReducers({
  Aside
});

const pages = combineReducers({
  DashboardPage,
  ClinicsListPage,
  ClinicDetailPage,
  DeclarationsListPage,
  DeclarationDetailPage,
  PendingDeclarationDetailPage,
  PendingDeclarationsListPage,
  EmployeesListPage,
  EmployeeDetailPage,

  ContractsListPage,
  ContractsDetailsPage,

  ContractRequestsListPage,
  ContractRequestsDetailsPage,

  ReportsListPage,

  PendingEmployeesListPage,
  PendingEmployeeDetailPage,

  InnmsListPage,
  InnmDetailPage,

  InnmDosagesListPage,
  InnmDosagesDetailPage,
  InnmDosagesCreatePage,

  MedicationsListPage,
  MedicationDetailPage,
  MedicationCreatePage,

  MedicalProgramsListPage,
  MedicalProgramDetailPage,

  ProgramMedicationsListPage,
  ProgramMedicationUpdatePage,
  ProgramMedicationDetailPage,
  ProgramMedicationCreatePage,

  MedicationRequestsListPage,
  MedicationRequestDetailPage,

  MedicationDispensesListPage,
  MedicationDispenseDetailPage,

  BlackUsersListPage,
  BlackListUserDetailPage,

  PartyUsersListPage,

  PersonSearchPage,
  RegistersPage,
  RegistersEntriesPage
});

const data = combineReducers({
  labels,
  dictionaries,
  clinics,

  declarations,
  declarationsStat,

  contracts,

  employees,
  employeesRequests,

  globalStat,
  detailStat,

  configuration,
  reports,
  capitation_reports,
  capitation_reports_list,

  innms,
  innm_dosages,

  medications,
  program_medications,

  medication_dispenses,
  medication_requests,
  medical_programs,

  black_list_users,
  party_users,

  persons,
  registers,
  register_entries
});

export default combineReducers({
  blocks,
  session,
  error,
  pages,
  data,
  // external libraries
  form,
  routing,
  loading
});

export const isAuthorized = state => state.session.authorized;

export const getLocation = state => state.routing.locationBeforeTransitions;
export const getForm = (state, formName) => state.form[formName] || {};

export const getTemplate = (state, id) =>
  denormalize(id, schemas.template, state.data);
export const getTemplates = (state, ids) =>
  denormalize(ids, [schemas.template], state.data);

export const getDictionaries = state => state.data.dictionaries;
export const getDictionary = (state, name) =>
  denormalize(name, schemas.dictionary, state.data);
export const getDictionaryValues = (state, name) => {
  const values = getDictionary(state, name).values;
  return Object.keys(values).map(key => ({ key, value: values[key] }));
};

export const getDictionariesNames = state =>
  Object.keys(getDictionaries(state)).map(name => ({ name, title: name }));
export const getDictionariesLabels = state => {
  const dictionaries = getDictionaries(state);
  return Object.keys(dictionaries).reduce((target, name) => {
    dictionaries[name].labels.forEach(label => {
      if (target.indexOf(label) === -1) {
        target.push(label);
      }
    });

    return target;
  }, []);
};

export const getClinics = (state, ids) =>
  denormalize(ids, [schemas.clinic], state.data);
export const getClinic = (state, id) =>
  denormalize(id, schemas.clinic, state.data);

export const getDeclarations = (state, ids) =>
  denormalize(ids, [schemas.declaration], state.data);
export const getDeclaration = (state, id) =>
  denormalize(id, schemas.declaration, state.data);

export const getContracts = (state, ids) =>
  denormalize(ids, [schemas.contract], state.data);
export const getContract = (state, id) =>
  denormalize(id, schemas.contract, state.data);

export const getEmployees = (state, ids) =>
  denormalize(ids, [schemas.employee], state.data);
export const getEmployee = (state, id) =>
  denormalize(id, schemas.employee, state.data);

export const getEmployeesRequests = (state, ids) =>
  denormalize(ids, [schemas.employeesRequest], state.data);
export const getEmployeeRequest = (state, id) =>
  denormalize(id, schemas.employeesRequest, state.data);

export const getGlobalSatistic = state => state.data.globalStat;
export const getDetailStatistic = (state, ids) =>
  denormalize(ids, [schemas.detailStat], state.data);

export const getDeclarationsStatByArea = (state, id) =>
  state.data.declarationsStat[id];

export const getConfiguration = state => state.data.configuration;

export const getReports = state => state.data.reports;

export const getCapitationReports = (state, ids) =>
  denormalize(ids, [schemas.capitation_report], state.data);
export const getCapitationReportsList = (state, ids) =>
  denormalize(ids, [schemas.capitation_reports_list], state.data);

export const getInnms = (state, ids) =>
  denormalize(ids, [schemas.innm], state.data);
export const getAllInnms = state =>
  getInnms(state, Object.keys(state.data.innms));
export const getInnm = (state, id) => denormalize(id, schemas.innm, state.data);

export const getInnmDosages = (state, ids) =>
  denormalize(ids, [schemas.innm_dosage], state.data);
export const getAllInnmDosages = state =>
  getInnmDosages(state, Object.keys(state.data.innm_dosages));
export const getInnmDosage = (state, id) =>
  denormalize(id, schemas.innm_dosage, state.data);

export const getMedications = (state, ids) =>
  denormalize(ids, [schemas.medication], state.data);
export const getMedication = (state, id) =>
  denormalize(id, schemas.medication, state.data);

export const getMedicationRequests = (state, ids) =>
  denormalize(ids, [schemas.medication_request], state.data);
export const getMedicationRequest = (state, id) =>
  denormalize(id, schemas.medication_request, state.data);

export const getMedicationDispenses = (state, ids) =>
  denormalize(ids, [schemas.medication_dispense], state.data);
export const getMedicationDispense = (state, id) =>
  denormalize(id, schemas.medication_dispense, state.data);

export const getMedicalPrograms = (state, ids) =>
  denormalize(ids, [schemas.medical_program], state.data);
export const getMedicalProgram = (state, id) =>
  denormalize(id, schemas.medical_program, state.data);

export const getProgramMedications = (state, ids) =>
  denormalize(ids, [schemas.program_medication], state.data);
export const getProgramMedication = (state, id) =>
  denormalize(id, schemas.program_medication, state.data);

export const getBlackUsers = (state, ids) =>
  denormalize(ids, [schemas.black_list_user], state.data);
export const getBlackUser = (state, id) =>
  denormalize(id, schemas.black_list_user, state.data);

export const getPartyUsers = (state, ids) =>
  denormalize(ids, [schemas.party_user], state.data);

export const getPersons = (state, ids) =>
  denormalize(ids, [schemas.person], state.data);

export const getRegisters = (state, ids) =>
  denormalize(ids, [schemas.register], state.data);

export const getRegisterEntry = (state, ids) =>
  denormalize(ids, [schemas.register_entry], state.data);
