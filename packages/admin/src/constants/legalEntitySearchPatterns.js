export const EDRPOU_PATTERN = "^[0-9]{8,10}$";
export const LEGAL_ENTITY_ID_PATTERN =
  "^[0-9A-Za-zА]{8}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{12}$";
export const LEGAL_ENTITY_SEARCH_PATTERN = `(${EDRPOU_PATTERN})|(${LEGAL_ENTITY_ID_PATTERN})`;
