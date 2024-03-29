import React from "react";
import { connect } from "react-redux";

import { H1 } from "../../../components/Title";
import FactorForm from "../../forms/FactorForm";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";

import { onSubmit } from "./redux";

const UpdateFactorPhonePage = ({ onSubmit = () => {} }) => (
  <Main id="new-factor-page">
    <Header>
      <H1>Введіть Ваш новий номер телефону</H1>
    </Header>
    <Article>
      <NarrowContainer>
        <FactorForm
          onSubmit={({ phone }) => onSubmit(phone.replace(/\s/g, ""))}
        />
      </NarrowContainer>
    </Article>
  </Main>
);

export default connect(null, { onSubmit })(UpdateFactorPhonePage);
