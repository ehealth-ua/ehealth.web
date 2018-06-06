import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import DeclarationPage from "./pages/DeclarationPage";
import SearchPage from "./pages/SearchPage";
import EmployeePage from "./pages/EmployeePage";
import DivisionPage from "./pages/DivisionPage";

const Routes = () => (
  <Layout>
    <Switch>
      <Route exact path="/(declarations)?" component={HomePage} />
      <Route exact path="/declarations/:id" component={DeclarationPage} />
      <Route exact path="/profile" component={ProfilePage} />
      <Route exact path="/profile/edit" component={ProfileEditPage} />

      <Route exact path="/search" component={SearchPage} />
      <Route exact path="/search/employee/:id" component={EmployeePage} />
      <Route exact path="/search/division/:id" component={DivisionPage} />
    </Switch>
  </Layout>
);

export default Routes;
