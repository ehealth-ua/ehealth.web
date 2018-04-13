import React from "react";
import { withRouter } from "react-router";

import { H2 } from "../../../components/Title";
import Button from "../../../components/Button";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import BackgroundLayout from "../../../components/BackgroundLayout";

const UpdatePasswordSuccessPage = ({
  location: { query: { password_update, invite = false, ...query } }
}) => (
  <Main id="update-factor-success-page">
    <Header>
      <BackgroundLayout />
      <H2>Пароль успішно змінено!</H2>
    </Header>
    <Article>
      <NarrowContainer>
        {invite ? (
          <Button color="green" to={{ pathname: "/invite", query: { invite } }}>
            Повернутися до запрошення
          </Button>
        ) : (
          <Button color="green" to={{ pathname: "/sign-in", query }}>
            Повернутися до входу
          </Button>
        )}
      </NarrowContainer>
    </Article>
  </Main>
);

export default withRouter(UpdatePasswordSuccessPage);
