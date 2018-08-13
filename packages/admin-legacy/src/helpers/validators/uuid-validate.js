import isUuidValid from "./uuid";

/**
 * We need this wrapper because:
 * 1. Redux-form has strange logic, we need to return undefined if value is valid.
 * 2. We must have control over error message.
 *
 * @link https://redux-form.com/6.4.3/examples/fieldlevelvalidation/
 *
 * @param value string Value to be validated.
 *
 * @returns {(undefined|string)} Undefined for ok, string for errors.
 */
const uuidValidate = value => {
  return !value || isUuidValid(value) ? undefined : "Некоректний формат";
};

export default uuidValidate;
