export const UUID_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";

export const TAX_ID_PATTERN = "^[0-9]{10}$";
export const NO_TAX_ID_DOCUMENT_PATTERN = "^([0-9]{9}|[А-ЯЁЇIЄҐ]{2}[0-9]{6})$";

export const EDRPOU_PATTERN = "^[0-9]{8,10}$";

export const INNM_PATTERN = "^[А-Яа-яЁёЇїІіЄєҐґ-\\s]*$";
export const INNM_ORIGINAL_NAME_PATTERN = "^[a-zA-Z-\\s]*$";
export const SCTID_PATTERN = "^[0-9]{8}$";

export const CYRILLIC_NAME = "^(?!.*[ЫЪЭЁыъэё@%&$^#])[А-ЯҐЇІЄа-яґїіє\\'\\- ]+$";
export const CYRILLIC_MEDICAL_PROGRAM_NAME = "^[А-Яа-яЁёЇїІіЄєҐґ'\\- ]*$";
