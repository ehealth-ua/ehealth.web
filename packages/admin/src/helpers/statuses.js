const DECLARATION = {
  TERMINATED: "розірвана",
  ACTIVE: "активна",
  REJECTED: "припинена",
  PENDING_VERIFICATION: "очікує підтвердження"
};

const PERSON = {
  ACTIVE: "активна",
  INACTIVE: "неактивна"
};

const LEGALENTITY = {
  ACTIVE: "активний",
  CLOSED: "неактивний"
};

const LEGAL_ENTITY_STATUS = {
  VERIFIED: "верифіковано",
  NOT_VERIFIED: "не верифіковано"
};

const LEGAL_ENTITY_TYPE = {
  PHARMACY: "Аптека",
  MSP: "заклад з надання медичних послуг",
  MIS: "Medical Information system"
};

const CONTRACT_REQUEST = {
  NEW: "новий",
  IN_PROCESS: "заява обробляється",
  DECLINED: "відмінений",
  APPROVED: "підтверджений",
  PENDING_NHS_SIGN: "очікує на підписання від НСЗУ",
  NHS_SIGNED: "підписаний НСЗУ",
  TERMINATED: "завершений",
  SIGNED: "підписаний"
};

const MERGE_LEGAL_ENTITIES_JOBS = {
  FAILED: "Помилка",
  FAILED_WITH_ERROR: "Помилка системи",
  PENDING: "В процесі виконання",
  PROCESSED: "Виконана"
};

const STATUSES = {
  PERSON,
  DECLARATION,
  LEGALENTITY,
  LEGAL_ENTITY_STATUS,
  LEGAL_ENTITY_TYPE,
  CONTRACT_REQUEST,
  MERGE_LEGAL_ENTITIES_JOBS
};

export default STATUSES;
