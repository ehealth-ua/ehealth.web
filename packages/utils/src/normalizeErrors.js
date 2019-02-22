import { FORM_ERROR } from "final-form";
import set from "lodash/set";
import normalizeInputErrors from "./normalizeInputErrors";

const normalizeErrors = (errors, prefix) => {
  const normalizedErrors = errors.reduce(
    (acc, { message, extensions: { code, exception } }) => {
      const error =
        exception && exception.inputErrors
          ? normalizeInputErrors(exception.inputErrors, prefix)
          : { [FORM_ERROR]: message };
      return { ...acc, ...error };
    },
    {}
  );

  return prefix ? set({}, prefix, normalizedErrors) : normalizedErrors;
};

export default normalizeErrors;
