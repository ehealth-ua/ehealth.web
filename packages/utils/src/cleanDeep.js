import transform from "lodash/transform";
import isPlainObject from "lodash/isPlainObject";
import isEmpty from "lodash/isEmpty";

const cleanDeep = (
  object,
  {
    emptyArrays = true,
    emptyObjects = true,
    emptyStrings = true,
    nullValues = true,
    undefinedValues = true
  } = {}
) =>
  transform(object, (result, value, key) => {
    // Recurse into arrays and objects.
    if (Array.isArray(value) || isPlainObject(value)) {
      value = cleanDeep(value, {
        emptyArrays,
        emptyObjects,
        emptyStrings,
        nullValues,
        undefinedValues
      });
    }

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) {
      return;
    }

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) {
      return;
    }

    // Exclude empty strings.
    if (emptyStrings && value === "") {
      return;
    }

    // Exclude null values.
    if (nullValues && value === null) {
      return;
    }

    // Exclude undefined values.
    if (undefinedValues && value === undefined) {
      return;
    }

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      return result.push(value);
    }

    result[key] = value;
  });

export default cleanDeep;
