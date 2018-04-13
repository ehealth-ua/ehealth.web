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

const UpdateFactorSignInPage = ({ onSubmit = () => {}, location, router }) => {
  const invite =
    location.query && location.query.invite
      ? `invite=${location.query.invite}`
      : false;

  return (
    <Main id="update-factor-page">
      <Header>
        <H1>Зміна фактора авторизації</H1>
      </Header>

      <Article>
        <NarrowContainer>
          <SignInForm
            onSubmit={onSubmit}
            initialValues={{
              email: location.query.email
            }}
          />
          <ButtonsGroup>
            <Button
              theme="link"
              onClick={() => {
                if (invite) return router.goBack();
                return router.push("/sign-in");
              }}
            >
              Назад
            </Button>
          </ButtonsGroup>
        </NarrowContainer>
      </Article>
    </Main>
  );
};

export default compose(withRouter, connect(null, { onSubmit }))(
  UpdateFactorSignInPage
);
