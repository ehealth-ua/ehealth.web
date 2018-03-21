import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import { Main, Header, Article } from "../../../components/CenterLayout";
import SignInForm from "../../forms/SignInForm";

import { onSubmit } from "./redux";

const SignInPage = ({ onSubmit = () => {}, location }) => (
  <Main id="sign-in-page">
    <Header>
      <H1>Вхід у систему eHealth</H1>
    </Header>
    <Article>
      <SignInForm
        onSubmit={onSubmit}
        initialValues={{
          email: location.query.email
        }}
      />
      <ButtonsGroup>
        <Button theme="link" to={`/update-password?${location.search}`}>
          Змінити пароль
        </Button>
        <Button theme="link" to="/reset">
          Забули пароль?
        </Button>
        <Button theme="link" to={`/update-factor/${location.search}`}>
          Змінити додатковий фактор авторизації
        </Button>
      </ButtonsGroup>
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit }))(SignInPage);
