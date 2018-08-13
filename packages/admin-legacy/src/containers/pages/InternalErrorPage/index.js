import React from "react";

import Helmet from "react-helmet";

import Button from "../../../components/Button/index";
import { H1 } from "../../../components/Title/index";

import styles from "./styles.module.css";

class InternalErrorPage extends React.Component {
  render() {
    return (
      <section className={styles.error} id="internal-error-page">
        <Helmet
          title={"Internal Error"}
          meta={[{ property: "og:title", content: "Internal Error" }]}
        />
        <div className={styles.error__main}>
          <H1>{"Internal Error"}</H1>
          <div>
            {"Sorry for this."}
            <br />
            <Button theme="link" to="/">
              {"Go to dashboard"}
            </Button>
          </div>
        </div>
      </section>
    );
  }
}

export default InternalErrorPage;
