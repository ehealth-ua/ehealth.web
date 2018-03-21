import React from "react";
import { withRouter } from "react-router";

import { H2 } from "../../../components/Title";
import Button from "../../../components/Button";
import { Main, Header, Article } from "../../../components/CenterLayout";

const UpdateFactorSuccessPage = ({ location }) => {
  const invite =
    location.query && location.query.invite
      ? `invite=${location.query.invite}`
      : false;

  return (
    <Main id="update-factor-success-page">
      <Header>
        <H2>Фактор було успішно змінено!</H2>
      </Header>
      <Article>
        {invite ? (
          <Button color="blue" to={`/invite?${invite}`}>
            Повернутися до запрошення
          </Button>
        ) : (
          <Button color="blue" to={`/sign-in/${location.search}`}>
            Повернутися до входу
          </Button>
        )}
      </Article>
    </Main>
  );
};

export default withRouter(UpdateFactorSuccessPage);
