const parseSearchParams = queryString =>
  Array.from(new URLSearchParams(queryString).entries()).reduce(
    (params, [name, value]) => ({ ...params, [name]: value }),
    {}
  );

export default parseSearchParams;
