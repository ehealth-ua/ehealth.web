const formatDate = value => {
  if (typeof value !== "string") return value;

  const digits = value.replace(/\D/g, "");

  const [_matches, year, month, day] = /(\d{0,4}?)(\d{0,2}?)(\d{0,2}?)$/.exec(
    digits
  );

  return [day, month, year].filter(Boolean).join("/");
};

export default formatDate;
