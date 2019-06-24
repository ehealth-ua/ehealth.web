const DECLARATION = {
  TERMINATED: "розірвана",
  ACTIVE: "активна",
  REJECTED: "відхилена",
  PENDING_VERIFICATION: "очікує підтвердження"
};

const PERSON = {
  ACTIVE: "активна",
  INACTIVE: "неактивна"
};

const LEGALENTITY = {
  ACTIVE: "активний",
  CLOSED: "неактивний",
  SUSPENDED: "призупинений",
  REORGANIZED: "реорганізований"
};

const DIVISIONS = {
  ACTIVE: "активний",
  INACTIVE: "неактивний"
};

const LEGAL_ENTITY_RELATION = {
  MERGED_FROM: "підпорядкованого",
  MERGED_TO: "основного"
};

const CONTRACT_REQUEST = {
  NEW: "НОВА",
  IN_PROCESS: "ОБРОБЛЯЄТЬСЯ",
  DECLINED: "ВІДМНІНЕНА",
  APPROVED: "ПІДТВЕРДЖЕНА",
  PENDING_NHS_SIGN: "ОЧІКУЄ НА ПІДПИСАННЯ НСЗУ",
  NHS_SIGNED: "ПІДПИСАНА НСЗУ",
  TERMINATED: "ЗАВЕРШЕНА",
  SIGNED: "ПІДПИСАНА"
};

const CONTRACT = {
  VERIFIED: "Верифікований",
  TERMINATED: "Завершений"
};

const SUSPENDED = {
  [false]: "Діючий",
  [true]: "Призупинений"
};

const EDR_VERIFY_STATUS = {
  [true]: "Веріфіковано",
  [false]: "Неверіфіковано"
};

const ACTIVE_STATUS_F = {
  [true]: "Активна",
  [false]: "Неактивна"
};

const ACTIVE_STATUS_M = {
  [true]: "Активний",
  [false]: "Неактивний"
};

const MEDICATION_REQUEST_ALLOWED = {
  [true]: "Дозволено",
  [false]: "Не дозволено"
};

const NO_TAX_ID = {
  [true]: "ІПН відсутній",
  [false]: "З ІПН"
};

const JOBS = {
  FAILED: "Помилка",
  PENDING: "В процесі виконання",
  PROCESSED: "Виконана"
};

const TASKS = {
  ABORTED: "Перервана",
  CONSUMED: "Прийнята на обробку",
  FAILED: "Помилка",
  NEW: "Створена",
  PENDING: "В процесі виконання",
  PROCESSED: "Виконана",
  RESCUED: "Системна помилка"
};

const REASON = {
  NO_TAX_ID: "Без ІПН"
};

const PATIENT_MERGE_REQUEST = {
  NEW: "Нова",
  POSTPONE: "Відкладена"
};

const REIMBURSEMENT_TYPES = {
  FIXED: "Фіксований"
};

const EMPLOYEE_STATUS = {
  APPROVED: "Активний",
  DISMISSED: "Звільнений"
};

const EMPLOYEE_REQUEST_STATUS = {
  APPROVED: "Схвалено",
  EXPIRED: "Прострочено",
  NEW: "Очікує верифікації",
  REJECTED: "Відхилено"
};

const YES_NO = {
  [true]: "Так",
  [false]: "Ні"
};

const STATUSES = {
  CONTRACT,
  PERSON,
  PATIENT_MERGE_REQUEST,
  DECLARATION,
  REASON,
  LEGALENTITY,
  DIVISIONS,
  LEGAL_ENTITY_RELATION,
  CONTRACT_REQUEST,
  JOBS,
  TASKS,
  MEDICATION_REQUEST_ALLOWED,
  REIMBURSEMENT_TYPES,
  SUSPENDED,
  ACTIVE_STATUS_F,
  ACTIVE_STATUS_M,
  NO_TAX_ID,
  EDR_VERIFY_STATUS,
  EMPLOYEE_STATUS,
  EMPLOYEE_REQUEST_STATUS,
  YES_NO
};

export default STATUSES;
