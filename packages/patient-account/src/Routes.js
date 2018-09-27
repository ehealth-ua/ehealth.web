import React from "react";
import { Router } from "@reach/router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import DeclarationPage from "./pages/DeclarationPage";
import DeclarationRequestPage from "./pages/DeclarationRequestPage";
import SearchPage from "./pages/SearchPage";
import EmployeePage from "./pages/EmployeePage";
import DivisionPage from "./pages/DivisionPage";
import SecurityPage from "./pages/SecurityPage";

const Routes = () => (
  <Layout>
    <Router>
      <HomePage path="/*" />
      <DeclarationPage path="/declarations/:id" />
      <DeclarationRequestPage path="/declaration_requests/:id" />
      <ProfilePage path="/profile" />
      <ProfileEditPage path="/profile/edit" />
      <SearchPage path="/search/*" />
      <EmployeePage path="/employee/:id" />
      <DivisionPage path="/division/:id" />
      <SecurityPage path="/security" />
    </Router>
  </Layout>
);

export default Routes;
