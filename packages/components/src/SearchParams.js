import React from "react";
import { Route } from "react-router-dom";
import { parseSearchParams } from "@ehealth/utils";

const SearchParams = ({ children, render = children }) => (
  <Route
    render={({ location: { search } }) => render(parseSearchParams(search))}
  />
);

export default SearchParams;
