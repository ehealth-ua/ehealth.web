import React from "react";
import { Form } from "@ehealth/components";

import { Main, Header, Article } from "../../../components/CenterLayout";
import { H1, H3 } from "../../../components/Title";

const SignUpNextPage = ({ params, children }) => (
  <Main>
    <Header>
      <H1>Авторизація в системі</H1>
      <p>dima@nebo15.com</p>
      <p>ИНН: 123123123</p>
      <p>Громадянство: Україна</p>
    </Header>
    <Article>
      <H3>Для продовження, додайте персональні дані</H3>
      <Form
        initialValues={{ authPhoneMatchesEmergencyContact: true }}
        onSubmit={v => {}}
      >
        {children}
      </Form>
    </Article>
  </Main>
);

export default SignUpNextPage;
