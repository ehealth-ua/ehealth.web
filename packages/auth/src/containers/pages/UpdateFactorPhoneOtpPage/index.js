import React from "react";
import { connect } from "react-redux";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";

import { H2 } from "../../../components/Title";
import OtpForm from "../../forms/OtpForm";
import Button from "../../../components/Button";
import { onSubmit } from "./redux";

const UpdateFactorOtpNewPage = ({ onSubmit = () => {}, location }) => (
  <Main id="new-factor-approve-page">
    <Header>
      <H2>Введіть код, що було надіслано на Ваш новий телефон</H2>
    </Header>
    <Article>
      <NarrowContainer>
        <OtpForm onSubmit={onSubmit} />
        <Button theme="link" to={`/update-factor/${location.search}`}>
          Повернутися на початок
        </Button>
      </NarrowContainer>
    </Article>
  </Main>
);

export default connect(null, { onSubmit })(UpdateFactorOtpNewPage);
