const DECLARATION = {
  TERMINATED: "розірвана",
  ACTIVE: "активна",
  REJECTED: "припинена",
  PENDING_VERIFICATION: "очікує підтвердження",
  APPROVED: "очікує підпису"
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

const STATUSES = {
  PERSON,
  DECLARATION,
  LEGALENTITY,
  LEGAL_ENTITY_STATUS,
  LEGAL_ENTITY_TYPE
};

export default STATUSES;
