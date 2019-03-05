import capitalize from "lodash/capitalize";

const normalizeName = (name = "") =>
  name.replace(/[\wа-яґїіє]+/gi, word => capitalize(word));

export default normalizeName;
