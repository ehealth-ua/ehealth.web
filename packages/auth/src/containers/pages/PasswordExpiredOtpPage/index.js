import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H2, H1 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import OtpForm from "../../forms/OtpForm";
import BackgroundLayout from "../../../components/BackgroundLayout";

import { onSubmit, onResend } from "./redux";

const PasswordExpiredOtpPage = ({
  onSubmit = () => {},
  onResend = () => {},
  router
}) => (
  <Main id="new-factor-approve-page">
    <Header>
      <BackgroundLayout />
      <H1>Введення коду з СМС</H1>
      <br />
      <br />
      <H2 textTransform="initial" color="red">
        Введіть код, що прийшов на телефон
      </H2>
    </Header>
    <Article>
      <NarrowContainer>
        <OtpForm
          onSubmit={onSubmit}
          onResend={onResend}
          btnColor="green"
          repeat
        />
        <ButtonsGroup>
          <Button theme="link" onClick={() => router.goBack()}>
            Назад
          </Button>
        </ButtonsGroup>
      </NarrowContainer>
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit, onResend }))(
  PasswordExpiredOtpPage
);
