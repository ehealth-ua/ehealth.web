const getFullName = ({
  first_name: firstName,
  second_name: secondName,
  last_name: lastName
}) => [firstName, secondName, lastName].filter(Boolean).join(" ");

export default getFullName;
