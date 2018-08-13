import { schema } from "normalizr";

export const template = new schema.Entity("templates");
export const dictionary = new schema.Entity(
  "dictionaries",
  {},
  { idAttribute: "name" }
);

export const clinic = new schema.Entity("clinics");
export const declaration = new schema.Entity("declarations");
export const contract = new schema.Entity("contracts");
export const capitation_report = new schema.Entity("capitation_reports");
export const capitation_reports_list = new schema.Entity(
  "capitation_reports_list"
);
export const employee = new schema.Entity("employees");
export const employeesRequest = new schema.Entity("employeesRequests");

export const globalStat = new schema.Entity("globalStat");
export const detailStat = new schema.Entity("detailStat");
export const declarationsStat = new schema.Entity("declarationsStat");

export const innm = new schema.Entity("innms");
export const innm_dosage = new schema.Entity("innm_dosages");
export const medication = new schema.Entity("medications");
export const medication_request = new schema.Entity("medication_requests");
export const medication_dispense = new schema.Entity("medication_dispenses");
export const medical_program = new schema.Entity("medical_programs");
export const program_medication = new schema.Entity("program_medications");

export const black_list_user = new schema.Entity("black_list_users");
export const party_user = new schema.Entity("party_users");

export const person = new schema.Entity("persons");
export const register = new schema.Entity("registers");
export const register_entry = new schema.Entity("register_entries");
