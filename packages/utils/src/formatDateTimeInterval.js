const formatDateTimeInterval = (from, to = "..") =>
  from ? `${from}/${to}` : undefined;

export default formatDateTimeInterval;
