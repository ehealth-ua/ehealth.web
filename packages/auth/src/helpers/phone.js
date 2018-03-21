const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (!previousValue || value.length > previousValue.length) {
    if (onlyNums.length === 0) {
      return `${onlyNums} `;
    }
    if (onlyNums.length === 5) {
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
    }
  }
  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length <= 5) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
  }

  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
  }
  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(
    5,
    7
  )} ${onlyNums.slice(7, 9)}`;
};

export default normalizePhone;
