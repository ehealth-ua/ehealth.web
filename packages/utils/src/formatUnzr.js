const UNZR_REGEX = /^(\d{0,8})(\d{0,5})/;

const formatUnzr = (value = "") => {
  const digits = value.replace(/[^\d]/g, "");
  const [, birthDate, id] = UNZR_REGEX.exec(digits);

  return [birthDate, id].filter(Boolean).join("-");
};

export default formatUnzr;
