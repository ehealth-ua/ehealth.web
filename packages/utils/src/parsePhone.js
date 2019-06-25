const parsePhone = string => {
  const parsedPhone = `+${string.replace(/[^\d]/g, "").substr(0, 12)}`;
  return parsedPhone.length < 4 ? undefined : parsedPhone;
};

export default parsePhone;
