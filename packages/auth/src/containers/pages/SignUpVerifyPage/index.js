import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import {
  Form,
  Field,
  Validation,
  Validations,
  SUBMIT_ERROR
} from "@ehealth/components";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import { verifyEmail } from "../../../redux/cabinet";

import env from "../../../env";

const SignUpVerifyPage = ({ router, verifyEmail }) => (
  <Main>
    <Header>
      <H1>Реєстрація</H1>
    </Header>
    <Article>
      <p>Будь ласка, надайте вашу email-адресу</p>
      <NarrowContainer>
        <Form
          onSubmit={async ({ email }) => {
            const {
              error,
              payload: { response }
            } = await verifyEmail({
              email
            });

            if (error) return { [SUBMIT_ERROR]: response.error.invalid };

            router.push({
              pathname: "/sign-up/confirmation",
              query: { email }
            });
          }}
        >
          <Field.Text name="email" placeholder="user@email.ua" />
          <Validations field="email">
            <Validation.Required message="Об'язкове поле" />
            <Validation.Email message="Невірний формат" />
            <Validation.Submit
              rule="email_exists"
              message="Користувач з цим email вже зареєстрований"
            />
          </Validations>
          <Form.Submit block>Далі</Form.Submit>
        </Form>
      </NarrowContainer>
      <p>
        Вже зареєстровані?{" "}
        <Link
          to={`/sign-in?client_id=${
            env.REACT_APP_PATIENT_ACCOUNT_CLIENT_ID
          }&scope=&redirect_uri=${env.REACT_APP_PATIENT_ACCOUNT_REDIRECT_URI}`}
        >
          Авторизуйтеся
        </Link>
      </p>
    </Article>
  </Main>
);

export default connect(
  null,
  { verifyEmail }
)(SignUpVerifyPage);
