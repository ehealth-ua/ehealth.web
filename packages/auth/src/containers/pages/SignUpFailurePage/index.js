import React from "react";
import { Button, Switch } from "@ehealth/components";

import { Main, Header, Article } from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";

const SignUpFailurePage = ({ params, router }) => (
  <Main>
    <Header>
      <H1>Реєстрація</H1>
    </Header>
    <Article>
      <Switch
        value={params.type}
        email_exists={
          <>
            <p>Користувач з такою email-адресою вже існує.</p>
            <Button to="/sign-up">Обрати іншу email-адресу</Button>
          </>
        }
        tax_id_exists={
          <>
            <p>Користувач з таким ідентифікаційним номером вже існує.</p>
            <Button to="/sign-in">Увійти</Button>
          </>
        }
        jwt_expired={
          <>
            <p>Час заповнення форми вичерпався.</p>
            <p>Будь ласка, відправте форму повторно.</p>
            <Button onClick={router.goBack}>Відправити повторно</Button>
          </>
        }
        access_denied={null}
      />
    </Article>
  </Main>
);

export default SignUpFailurePage;
