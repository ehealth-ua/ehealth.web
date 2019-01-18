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

const MERGE_LEGAL_ENTITIES_JOBS = {
  FAILED: "Помилка",
  FAILED_WITH_ERROR: "Помилка системи",
  PENDING: "В процесі виконання",
  PROCESSED: "Виконана"
};

const STATUSES = {
  CONTRACT,
  PERSON,
  DECLARATION,
  LEGALENTITY,
  LEGAL_ENTITY_RELATION,
  CONTRACT_REQUEST,
  MERGE_LEGAL_ENTITIES_JOBS,
  SUSPENDED
};

export default STATUSES;
