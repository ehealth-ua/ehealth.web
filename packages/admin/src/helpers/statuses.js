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
  VERIFIED: "Верифіковано",
  NOT_VERIFIED: "Не верифіковано"
};

const LEGAL_ENTITY_TYPE = {
  PHARMACY: "Аптека",
  MSP: "Заклад з надання медичних послуг",
  NHS: "Національна служба здоров'я України"
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
  VERIFIED: "верифікований",
  TERMINATED: "завершений"
};

const MERGE_LEGAL_ENTITIES_JOBS = {
  FAILED: "Помилка",
  FAILED_WITH_ERROR: "Помилка системи",
  PENDING: "В процесі виконання",
  PROCESSED: "Виконана"
};
const NHS_PAYMENT_METHOD = {
  BACKWARD: "Передоплата",
  FORWARD: "Післяоплата"
};

const CONTRACT_REQUEST_UPDATE_MISCELLANEOUS =
  "Цим повідомленням НСЗУ висловлює намір укласти договір про медичне обслуговування населення за програмою медичних гарантій на умовах, визначених в оголошенні про укладення договорів. Просимо заповнити проект договору з додатками, скріпити електронним цифровим підписом та надіслати до НСЗУ. У разі виникнення запитань щодо заповнення форми договору, будь ласка, звертайтеся за адресою електронної пошти: info@nszu.gov.ua, або за телефоном: (044) 229-92-54. З повагою, Голова НСЗУ, Олег ПЕТРЕНКО";

const STATUSES = {
  CONTRACT,
  PERSON,
  DECLARATION,
  LEGALENTITY,
  LEGAL_ENTITY_STATUS,
  LEGAL_ENTITY_TYPE,
  CONTRACT_REQUEST,
  MERGE_LEGAL_ENTITIES_JOBS,
  NHS_PAYMENT_METHOD,
  CONTRACT_REQUEST_UPDATE_MISCELLANEOUS
};

export default STATUSES;
