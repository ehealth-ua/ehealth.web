import React from "react";
import { Route } from "react-router-dom";
import { parseSearchParams, stringifySearchParams } from "@ehealth/utils";
import compose from "recompose/compose";
import isEqual from "lodash/isEqual";

const setSearchParams = (params, method, location, history) => {
  const search = compose(stringifySearchParams, parseSearchParams)(
    location.search
  );
  if (isEqual(stringifySearchParams(params), search)) return null;
  history[method]({ ...location, search: stringifySearchParams(params) });
};

const SearchParams = ({ children, render = children }) => (
  <Route
    render={({ location, history }) => {
      return render({
        searchParams: parseSearchParams(location.search),
        setSearchParamsImmediate: (params, method = "replace") =>
          setSearchParams(params, method, location, history)
      });
    }}
  />
);

export default SearchParams;
