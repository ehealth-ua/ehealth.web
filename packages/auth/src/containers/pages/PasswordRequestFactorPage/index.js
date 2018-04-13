import React from "react";
import { connect } from "react-redux";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1, H2 } from "../../../components/Title";
import FactorForm from "../../forms/FactorForm";
import BackgroundLayout from "../../../components/BackgroundLayout";

import { onSubmit } from "./redux";

const PasswordRequestFactorPage = ({ onSubmit = () => {} }) => (
  <Main id="change-otp-page">
    <Header>
      <BackgroundLayout />
      <H1>Встановлення фактора авторизації</H1>
      <br />
      <br />
      <H2 textTransform="initial" color="red">
        Введіть телефон, який буде використано при вході в систему
      </H2>
    </Header>
    <Article>
      <NarrowContainer>
        <FactorForm
          noLabel={false}
          btnColor="green"
          onSubmit={({ phone }) => onSubmit(phone.replace(/\s/g, ""))}
        />
      </NarrowContainer>
    </Article>
  </Main>
);

export default connect(null, { onSubmit })(PasswordRequestFactorPage);
