import set from "lodash/set";

const normalizeInputErrors = (inputErrors = []) =>
  inputErrors.reduce((acc, { path, ...error }) => set(acc, path, error), {});

export default normalizeInputErrors;
