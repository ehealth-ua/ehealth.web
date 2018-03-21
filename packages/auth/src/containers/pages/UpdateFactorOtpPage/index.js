import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { Main, Header, Article } from "../../../components/CenterLayout";
import { H2 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import OtpForm from "../../forms/OtpForm";

import { onSubmit, onResend } from "./redux";

const UpdateFactorOtpPage = ({
  onSubmit = () => {},
  onResend = () => {},
  router
}) => (
  <Main id="new-factor-approve-page">
    <Header>
      <H2>Введіть код, який було відправлено на Ваш існуючий телефон</H2>
    </Header>
    <Article>
      <OtpForm onSubmit={onSubmit} onResend={onResend} repeat />
      <ButtonsGroup>
        <Button theme="link" onClick={() => router.goBack()}>
          Назад
        </Button>
      </ButtonsGroup>
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit, onResend }))(
  UpdateFactorOtpPage
);
