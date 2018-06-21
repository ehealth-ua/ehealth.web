const getFullName = ({ firstName, secondName, lastName }) =>
  [lastName, firstName, secondName].filter(Boolean).join(" ");

export default getFullName;
