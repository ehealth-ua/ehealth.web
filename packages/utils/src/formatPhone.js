const PHONE_REGEX = /(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/;

const formatPhone = (value = "") => {
  const digits = value.replace(/[^\d]/g, "");
  const [_result, _countryCode, areaCode, ...numberSegments] = PHONE_REGEX.exec(
    digits
  );

  const code = ["+38", areaCode].filter(Boolean).join(" (");
  const number = numberSegments.filter(Boolean).join("-");
  return [code, number].filter(Boolean).join(") ");
};

export default formatPhone;
