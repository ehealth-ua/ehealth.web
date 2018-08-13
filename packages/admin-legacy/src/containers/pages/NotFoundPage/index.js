import React from "react";

import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import Button from "../../../components/Button";

import styles from "./styles.module.css";

class NotFoundPage extends React.Component {
  render() {
    return (
      <section className={styles.error} id="not-found-page">
        <Helmet
          title="Сторінка не знайдена"
          meta={[{ property: "og:title", content: "Сторінка не знайдена" }]}
        />
        <div className={styles.error__main}>
          <H1>Сторінка не знайдена</H1>
          <div>
            Запитувана сторінка не знайдена.{" "}
            <Button theme="link" to="/">
              Перейти на головну
            </Button>.
          </div>
        </div>
      </section>
    );
  }
}

export default NotFoundPage;
