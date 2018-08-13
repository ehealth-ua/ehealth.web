import React from "react";
import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <section id="access-denied-page">
        <Helmet
          title="Доступ обмежений"
          meta="og:title"
          content="Доступ обмежений"
        />
        <H1>Доступ обмежений</H1>
        <p>
          Ви не маєте доступу до цієї сторінки. Спробуйте перезайти до системи з
          новою роллю або зателефонуйте до підтримки.
        </p>
      </section>
    );
  }
}
