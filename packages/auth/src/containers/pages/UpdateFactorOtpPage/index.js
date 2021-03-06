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
import { H2 } from "../../../components/Title";
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
      <NarrowContainer>
        <OtpForm onSubmit={onSubmit} onResend={onResend} repeat />
      </NarrowContainer>
    </Article>
  </Main>
);

export default compose(withRouter, connect(null, { onSubmit, onResend }))(
  UpdateFactorOtpPage
);
