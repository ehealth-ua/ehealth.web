import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withGoogleReCaptcha } from "react-google-recaptcha-v3";

import env from "../../../env";

import { H1 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import SignInForm from "../../forms/SignInForm";

import { onSubmit, idGovUaAuthenticate } from "./redux";

const SignInPage = ({
  onSubmit = () => {},
  idGovUaAuthenticate,
  location: {
    search,
    query: { client_id, redirect_uri, scope, email }
  },
  router,
  googleReCaptchaProps
}) => (
  <Main id="sign-in-page">
    <Header>
      <H1>
        ВХІД У ЕЛЕКТРОННУ СИСТЕМУ <br /> ОХОРОНИ ЗДОРОВ’Я
      </H1>
    </Header>
    <Article>
      {!client_id && <p>Не вказано адресу зворотнього визову</p>}
      {!redirect_uri && (
        <p>Не вказаний ідентифікатор додатку для авторизації</p>
      )}
      {client_id &&
        redirect_uri && (
          <NarrowContainer>
            <SignInForm
              onSubmit={async data => {
                const token = await googleReCaptchaProps.executeRecaptcha(
                  "SignInPage"
                );
                return onSubmit(data, token);
              }}
              initialValues={{ email }}
            />
            {env.REACT_APP_DIGITAL_SIGNATURE_SIGN_IN_ENABLED && (
              <Button
                color="blue"
                onClick={() =>
                  router.push(`/sign-in/digital-signature${search}`)
                }
                block
              >
                увійти за допомогою ЕЦП
              </Button>
            )}
            {env.REACT_APP_ID_GOV_UA_SIGN_IN_ENABLED && (
              <Button
                color="blue"
                onClick={async () => {
                  const token = await googleReCaptchaProps.executeRecaptcha(
                    "IdGovUaSignIn"
                  );
                  return idGovUaAuthenticate({
                    token,
                    client_id,
                    redirect_uri,
                    scope
                  });
                }}
                block
              >
                увійти за допомогою GOV ID
              </Button>
            )}
            <ButtonsGroup>
              {env.REACT_APP_SIGN_UP_ENABLED && (
                <Button theme="link" to="/sign-up">
                  Зареєструватися
                </Button>
              )}
              <Button theme="link" to={`/update-password/${search}`}>
                Змінити пароль
              </Button>
              <Button theme="link" to={`/reset/${search}`}>
                Забули пароль?
              </Button>
            </ButtonsGroup>
          </NarrowContainer>
        )}
    </Article>
  </Main>
);

export default compose(
  withRouter,
  withGoogleReCaptcha,
  connect(
    null,
    { onSubmit, idGovUaAuthenticate }
  )
)(SignInPage);
