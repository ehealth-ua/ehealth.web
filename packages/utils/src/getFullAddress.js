const getFullAddress = ({
  zip,
  country,
  area,
  region,
  settlement,
  street,
  building,
  apartment
}) => {
  const address = [
    zip,
    country,
    `${area} Область`,
    region,
    settlement,
    street,
    building,
    `кв.${apartment}`
  ]
    .filter(Boolean)
    .join(", ");
  if (!address) return null;
  return address;
};

export default getFullAddress;
