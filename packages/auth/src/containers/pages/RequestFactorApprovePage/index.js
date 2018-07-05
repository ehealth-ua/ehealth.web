import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1, H2 } from "../../../components/Title";
import OtpForm from "../../forms/OtpForm";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import Button from "../../../components/Button";

import { onSubmit } from "./redux";

const RequestFactorOtpPage = ({ onSubmit = () => {}, location }) => {
  const invite =
    location.query && location.query.invite
      ? `invite=${location.query.invite}`
      : false;
  return (
    <Main id="factor-approve-page">
      <Header>
        <H1>Введення коду</H1>
        <H2 textTransform="initial">Введіть код, що прийшов на телефон</H2>
      </Header>
      <Article>
        <NarrowContainer>
          <OtpForm onSubmit={onSubmit} />
          {invite ? (
            <Button theme="link" to={`/invite?${invite}`}>
              Повернутися до запрошення
            </Button>
          ) : (
            <Button theme="link" to={`/sign-in/${location.search}`}>
              Повернутися до входу
            </Button>
          )}
        </NarrowContainer>
      </Article>
    </Main>
  );
};

export default compose(withRouter, connect(null, { onSubmit }))(
  RequestFactorOtpPage
);
