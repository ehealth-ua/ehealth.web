import React from "react";
import { Switch } from "@ehealth/components";

import { Main, Header, Article } from "../../../components/CenterLayout";
import { H1, H2 } from "../../../components/Title";
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
        wrong_url={
          <>
            <p>Наданий авторизаційний адрес не співпадає з зареєстрованим.</p>
            <p>Зверніться до служби підтримки</p>
          </>
        }
        invalid_client_id={
          <>
            <p>Невірно передано ідентифікатор користувача.</p>
            <p>Зверніться до служби підтримки</p>
          </>
        }
        invalid_token_type={
          <>
            <p>Упс. Щось пішло не так. Повторіть спробу.</p>
            <Button to={{ ...location, pathname: "/sign-in" }} color="blue">
              Повернутися до входу
            </Button>
          </>
        }
        global_user_scope_error={
          <>
            <p>У даного користувача недостатньо прав для доступу</p>
            <p>Зверніться до служби підтримки</p>
          </>
        }
        user_blocked={
          <>
            <H2 textTransform="uppercase" color="red">
              Користувача заблоковано
            </H2>
            <p>
              При виникненні запитань, будь ласка<br />
              <a href="">зверніться до служби підтримки</a>
            </p>
            <Button to={{ ...location, pathname: "/sign-in" }} color="blue">
              Повернутися
            </Button>
          </>
        }
        default={
          <>
            <p>Упс. Щось пішло не так. Повторіть спробу пізніше.</p>
            <Button to={{ ...location, pathname: "/sign-in" }} color="blue">
              Повернутися
            </Button>
          </>
        }
        // access_denied={null}
      />
    </Article>
  </Main>
);

export default SignInFailurePage;
