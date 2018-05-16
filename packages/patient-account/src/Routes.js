import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";

const Routes = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/profile" component={Profile} />
    </Switch>
  </Layout>
);

export default Routes;
