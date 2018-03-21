import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1, H2 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import { Main, Header, Article } from "../../../components/CenterLayout";
import BackgroundLayout from "../../../components/BackgroundLayout";

import SignInForm from "../../forms/SignInForm";

import { onSubmit } from "./redux";

const PasswordExpiredSignInPage = ({ onSubmit = () => {}, router }) => (
  <Main id="sign-in-page">
    <Header>
      <BackgroundLayout />
      <H1>Вхід для зміни пароля</H1>
      <br />
      <br />
      <H2 textTransform="initial" color="red">
        Введіть електронну адресу та старий пароль
      </H2>
    </Header>
    <Article>
      <SignInForm onSubmit={onSubmit} btnColor="green" />
      <ButtonsGroup>
        <Button theme="link" onClick={() => router.goBack()}>
          Назад
        </Button>
      </ButtonsGroup>
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit }))(
  PasswordExpiredSignInPage
);
