const formatWorkingHours = (weekDays, workingHours) => {
  const sortedWorkingDays = weekDays
    .map(({ key, value }) => ({
      day: value,
      hours: workingHours[key]
    }))
    .filter(({ day, hours }) => hours);

  return sortedWorkingDays;
};

export default formatWorkingHours;
