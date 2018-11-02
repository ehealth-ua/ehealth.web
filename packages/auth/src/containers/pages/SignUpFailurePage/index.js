import React from "react";
import { Switch } from "@ehealth/components";
import { Link } from "react-router";
import Button from "../../../components/Button";
import {
  REACT_APP_PATIENT_ACCOUNT_CLIENT_ID,
  REACT_APP_PATIENT_ACCOUNT_REDIRECT_URI
} from "../../../env";
import { Main, Header, Article } from "../../../components/CenterLayout";
import { H1, H2 } from "../../../components/Title";

const SignUpFailurePage = ({ params, location }) => (
  <Main>
    <Header>
      <H1>Помилка</H1>
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
            <Button
              to={{
                pathname: "/sign-in",
                query: {
                  client_id: REACT_APP_PATIENT_ACCOUNT_CLIENT_ID,
                  redirect_uri: REACT_APP_PATIENT_ACCOUNT_REDIRECT_URI
                }
              }}
            >
              Увійти
            </Button>
          </>
        }
        jwt_expired={
          <>
            <p>Час заповнення форми вичерпався.</p>
            <p>Будь ласка, відправте форму повторно.</p>
            <Link to={{ ...location, pathname: "/sign-up/continue" }}>
              <Button>Відправити повторно</Button>
            </Link>
          </>
        }
        access_denied={
          <>
            <H2 textTransform="uppercase" color="red">
              Користувача заблоковано
            </H2>
            {/* <p>
              При виникненні запитань, будь ласка<br />
              <a href="">зверніться до служби підтримки</a>
            </p> */}
            <Button to={{ ...location, pathname: "/sign-up/continue" }}>
              Повернутися
            </Button>
          </>
        }
        default={
          <>
            <H2 textTransform="uppercase">Внутрішня помилка</H2>
            <p>Вибачте за тимчасові незручності</p>
            {/* <p>
              При виникненні запитань, будь ласка<br />
              <a href="">зверніться до служби підтримки</a>
            </p> */}
            <Button to={{ ...location, pathname: "/sign-up/continue" }}>
              Повернутися
            </Button>
          </>
        }
      />
    </Article>
  </Main>
);

export default SignUpFailurePage;
