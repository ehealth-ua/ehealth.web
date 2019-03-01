export const EDRPOU_PATTERN = "^[0-9]";
export const CONTRACT_PATTERN =
  "^[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}-[0-9A-Za-zА-ЯҐЇІЄа-яґїіє]{4}$";
export const SEARCH_CONTRACT_PATTERN = `(${EDRPOU_PATTERN})|(${CONTRACT_PATTERN})`;
