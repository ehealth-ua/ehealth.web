const convertStringToBoolean = item => {
  try {
    return JSON.parse(item);
  } catch (error) {
    return undefined;
  }
};

export default convertStringToBoolean;
