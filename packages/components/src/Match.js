import React from "react";
import { Route } from "react-router-dom";

const Match = ({ path, exact, children, render = children }) => (
  <Route
    path={path}
    exact={exact}
    children={({ match }) => render({ to: path, active: match != null })}
  />
);

export default Match;
