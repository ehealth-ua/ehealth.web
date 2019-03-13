const formatDateInterval = (from = "..", to = "..") => {
  return from === ".." && to === ".." ? undefined : `${from}/${to}`;
};

export default formatDateInterval;
