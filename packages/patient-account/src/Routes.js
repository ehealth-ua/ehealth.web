import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

const Routes = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={HomePage} />
    </Switch>
  </Layout>
);

export default Routes;
