import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import Button, { ButtonsGroup } from "../../../components/Button";
import SignUpVerifyForm from "../../forms/SignUpVerifyForm";

import { onSubmit } from "./redux";

const SignUpVerifyPage = ({ onSubmit }) => (
  <Main>
    <Header>
      <H1>Реєстрація</H1>
    </Header>
    <Article>
      <p>Будь ласка, надайте вашу email-адресу</p>
      <NarrowContainer>
        <SignUpVerifyForm onSubmit={onSubmit} />
      </NarrowContainer>
      <p>
        Вже зареєстровані? <Link to="/sign-in">Авторизуйтеся</Link>
      </p>
    </Article>
  </Main>
);

export default connect(null, { onSubmit })(SignUpVerifyPage);
