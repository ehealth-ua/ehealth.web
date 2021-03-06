import React from "react";
import { connect } from "react-redux";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import FactorForm from "../../forms/FactorForm";

import { onSubmit } from "./redux";

const RequestFactorPage = ({ onSubmit = () => {} }) => (
  <Main id="change-otp-page">
    <Header>
      <H1>
        ВХІД У ЕЛЕКТРОННУ СИСТЕМУ <br /> ОХОРОНИ ЗДОРОВ’Я
      </H1>
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

export default connect(
  null,
  { onSubmit }
)(RequestFactorPage);
