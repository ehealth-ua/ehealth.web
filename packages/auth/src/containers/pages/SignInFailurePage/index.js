import React from "react";
import { Switch } from "@ehealth/components";

import { Main, Header, Article } from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import Button from "../../../components/Button";

const SignInFailurePage = ({ params, location }) => (
  <Main>
    <Header>
      <H1>Вхід до системи</H1>
    </Header>
    <Article>
      <Switch
        value={params.type}
        access_denied={
          <>
            <p>Користувача не знайдено. Спочатку потрібно зареєструватись.</p>
            <Button color="blue" to="/sign-up">
              Реєстрація
            </Button>
          </>
        }
        default={
          <>
            <p>Упс. Щось пішло не так. Повторіть спробу пізніше.</p>
            <Button color="blue" to="/sign-up">
              Реєстрація
            </Button>
          </>
        }
        // access_denied={null}
      />
    </Article>
  </Main>
);

export default SignInFailurePage;
