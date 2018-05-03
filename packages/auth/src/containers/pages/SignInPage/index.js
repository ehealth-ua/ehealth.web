import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

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

class SignInPage extends React.Component {
  renderNotFoundClientId() {
    return (
      <Main id="sign-in-page">
        <Header>
          <b>Помилка</b>
        </Header>
        <Article>
          <p>Не вказан идентифікатор додатку для авторизації</p>
        </Article>
      </Main>
    );
  }
  renderNotFoundRedirectUri() {
    return (
      <Main id="sign-in-page">
        <Header>
          <b>Помилка</b>
        </Header>
        <Article>
          <p>Не вказано адресу зворотнього визову</p>
        </Article>
      </Main>
    );
  }
  render() {
    const {
      onSubmit = () => {},
      location: { search, query: { client_id, redirect_uri, email } }
    } = this.props;
    if (!client_id) return this.renderNotFoundClientId();
    if (!redirect_uri) return this.renderNotFoundRedirectUri();

    return (
      <Main id="sign-in-page">
        <Header>
          <H1>Вхід у систему eHealth</H1>
        </Header>
        <Article>
          <NarrowContainer>
            <SignInForm
              onSubmit={onSubmit}
              initialValues={{
                email
              }}
            />
            <ButtonsGroup>
              <Button color="blue" to={`sign-in/digital-sign?${search}`}>
                увійти за допомогою ЕЦП
              </Button>
              <Button theme="link" to={`/update-password?${search}`}>
                Змінити пароль
              </Button>
              <Button theme="link" to="/reset">
                Забули пароль?
              </Button>
              <Button theme="link" to={`/update-factor/${search}`}>
                Змінити додатковий фактор авторизації
              </Button>
            </ButtonsGroup>
          </NarrowContainer>
        </Article>
      </Main>
    );
  }
}

export default compose(withRouter, connect(null, { onSubmit }))(SignInPage);
