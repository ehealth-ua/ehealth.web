import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";

const Routes = () => (
  <Layout>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/profile" component={ProfilePage} />
      <Route exact path="/profile/edit" component={ProfileEditPage} />
    </Switch>
  </Layout>
);

export default Routes;
