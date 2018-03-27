import React from "react";
import { Link } from "react-router";

import { Main, Header } from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";

import styles from "./styles.module.css";

const SignUpConfirmationPage = ({ location }) => (
  <Main>
    <Header>
      <H1>Email-авторизація</H1>
    </Header>
    <div className={styles.article}>
      <p>
        Ми відправили лист для авторизації на вашу email-адресу
        <div className={styles.email}>{location.query.email}</div>
        Будь ласка, перейдіть за посиланням, отриманному в листі
      </p>
      <p>
        Не отримали листа? Спробуйте{" "}
        <Link to="/sign-up">змінити email-адресу</Link>
      </p>
    </div>
  </Main>
);

export default SignUpConfirmationPage;
