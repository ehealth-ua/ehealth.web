import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Form } from "@ehealth/components";

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

const SignInPage = ({
  onSubmit = () => {},
  location: { search, query: { client_id, redirect_uri, email } },
  router
}) => (
  <Main id="sign-in-page">
    <Header>
      <H1>Вхід у систему eHealth</H1>
    </Header>
    <Article>
      {!client_id && <p>Не вказано адресу зворотнього визову</p>}
      {!redirect_uri && <p>Не вказан идентифікатор додатку для авторизації</p>}
      {client_id &&
        redirect_uri && (
          <NarrowContainer>
            <SignInForm onSubmit={onSubmit} initialValues={{ email }} />
            <Button
              color="blue"
              onClick={() => router.push(`/sign-in/digital-signature${search}`)}
              block
            >
              увійти за допомогою ЕЦП
            </Button>
            <ButtonsGroup>
              <Button theme="link" to="/sign-up">
                Зареєструватися
              </Button>
              <Button theme="link" to={`/update-password?${search}`}>
                Змінити пароль
              </Button>
              <Button theme="link" to={`/reset?${search}`}>
                Забули пароль?
              </Button>
              <Button theme="link" to={`/update-factor/${search}`}>
                Змінити додатковий фактор авторизації
              </Button>
            </ButtonsGroup>
          </NarrowContainer>
        )}
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit }))(SignInPage);
