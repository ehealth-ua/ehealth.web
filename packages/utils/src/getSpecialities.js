const getSpecialities = (userSpecialities, specialityTypes) => {
  let speciality;
  const userSpeciality = userSpecialities.find(
    item => item.speciality_officio && item
  );
  Object.entries(specialityTypes).map(([key, value]) => {
    if (userSpeciality && userSpeciality.speciality === key) {
      speciality = value;
    }
    return null;
  });
  return speciality;
};

export default getSpecialities;
