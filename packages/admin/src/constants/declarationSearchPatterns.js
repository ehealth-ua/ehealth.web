export const DECLARATION_ID_PATTERN =
  "^[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12}$";

export const DECLARATION_NUMBER_PATTERN =
  "^[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}$";
export const DECLARATION_SEARCH_PATTERN = `(${DECLARATION_ID_PATTERN})|(${DECLARATION_NUMBER_PATTERN})`;
