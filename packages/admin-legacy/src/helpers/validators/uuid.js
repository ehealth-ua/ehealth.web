/**
 * Simple check for valid UUID format.
 *
 * @link https://en.wikipedia.org/wiki/Universally_unique_identifier
 * @link https://stackoverflow.com/a/13653180
 *
 * @param {string} value Value to be checked.
 *
 * @returns {boolean}
 */
const isUuidValid = value => {
  return new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/
  ).test(value);
};

export default isUuidValid;
