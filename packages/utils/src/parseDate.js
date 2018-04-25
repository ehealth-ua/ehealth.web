const parseDate = text => {
  const digits = text.replace(/\D/g, "");

  const [_matches, day, month, year] = /^(\d{0,2})(\d{0,2})(\d{0,4})/.exec(
    digits
  );

  return [year, month, day].filter(Boolean).join("-");
};

export default parseDate;
