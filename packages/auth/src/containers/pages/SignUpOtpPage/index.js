import React from "react";
import { Link } from "react-router";
import { Field, Form, Validation, Validations } from "@ehealth/components";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";

const SignUpOtpPage = ({ location }) => (
  <Main>
    <Header>
      <H1>OTP-пароль</H1>
    </Header>
    <Article>
      <NarrowContainer>
        <p>Будь ласка, введіть 4 цифри, отримані вами у СМС-повідомленні</p>
        <Field.Input name="otp" placeholder="4 цифри з СМС" />
        <Validations field="otp">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Length
            options={{ min: 4, max: 4 }}
            message="Довжина становить 4 символи"
          />
        </Validations>
        <Form.Submit block>Відправити</Form.Submit>
        <Link to={{ ...location, pathname: "/sign-up/user" }}>Назад</Link>
      </NarrowContainer>
    </Article>
  </Main>
);

export default SignUpOtpPage;
