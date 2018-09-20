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

const STATUSES = {
  PERSON,
  DECLARATION
};

export default STATUSES;
