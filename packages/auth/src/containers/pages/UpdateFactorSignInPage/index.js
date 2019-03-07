import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withGoogleReCaptcha } from "react-google-recaptcha-v3";

import { H1 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import SignInForm from "../../forms/SignInForm";

import { onSubmit } from "./redux";

const UpdateFactorSignInPage = ({
  onSubmit = () => {},
  location,
  router,
  googleReCaptchaProps
}) => (
  <Main id="update-factor-page">
    <Header>
      <H1>Зміна фактора авторизації</H1>
    </Header>

    <Article>
      <NarrowContainer>
        <SignInForm
          onSubmit={async data => {
            const token = await googleReCaptchaProps.executeRecaptcha(
              "UpdateFactorSignInPage"
            );
            return onSubmit(data, token);
          }}
          initialValues={{
            email: location.query.email
          }}
        />
        <ButtonsGroup>
          <Button theme="link" onClick={router.goBack}>
            Назад
          </Button>
        </ButtonsGroup>
      </NarrowContainer>
    </Article>
  </Main>
);

export default compose(
  withRouter,
  withGoogleReCaptcha,
  connect(
    null,
    { onSubmit }
  )
)(UpdateFactorSignInPage);
