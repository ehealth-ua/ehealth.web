import { unflatten } from "flat";

const parseSearchParams = queryString => {
  const parseParams = Array.from(
    new URLSearchParams(queryString).entries()
  ).reduce((params, [name, value]) => ({ ...params, [name]: value }), {});
  return unflatten(parseParams);
};

export default parseSearchParams;
