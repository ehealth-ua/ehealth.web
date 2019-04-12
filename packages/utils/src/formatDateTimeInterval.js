const formatDateTimeInterval = (from, to) => {
  const timezoneOffsetFrom = new Date(from).getTimezoneOffset() / -60;
  const timezoneOffsetTo = new Date(to).getTimezoneOffset() / -60;

  const dateTimeFrom = !!timezoneOffsetFrom
    ? `${from}T00:00:00.000000+0${timezoneOffsetFrom}:00`
    : "..";
  const dateTimeTo = !!timezoneOffsetTo
    ? `${to}T23:59:59.999999+0${timezoneOffsetTo}:00`
    : "..";

  return dateTimeFrom === ".." && dateTimeTo === ".."
    ? undefined
    : `${dateTimeFrom}/${dateTimeTo}`;
};

export default formatDateTimeInterval;
