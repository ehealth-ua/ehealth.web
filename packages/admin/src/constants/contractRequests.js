export const EDRPOU_PATTERN = "^[0-9]{8,10}$";
export const CONTRACT_REQUEST_PATTERN =
  "^[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}$";
export const SEARCH_REQUEST_PATTERN = `(${EDRPOU_PATTERN})|(${CONTRACT_REQUEST_PATTERN})`;
