import fromPairs from "lodash/fromPairs";

const convertObjectKeys = (object, converter, keypath = []) => {
  if (object == null || typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map((o, index) =>
      convertObjectKeys(o, converter, [...keypath, String(index)])
    );
  }

  return fromPairs(
    Object.entries(object).map(([key, value]) => {
      const nestedKeyPath = [...keypath, key];
      const convertedKey = converter(key, nestedKeyPath);
      const convertedValue = convertObjectKeys(value, converter, nestedKeyPath);

      return [convertedKey, convertedValue];
    })
  );
};

export default convertObjectKeys;
