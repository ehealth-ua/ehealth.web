import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import BackLink from "../../blocks/BackLink";

import Line from "../../../components/Line";

import { getRegisters } from "../../../reducers";
import { fetchRegisters } from "../../../redux/registers";

import styles from "./styles.module.css";

const RegistersErrorsPage = ({
  register = {},
  paging = {},
  location,
  router
}) => (
  <div id="files-list-page">
    <Helmet
      title="реєстру"
      meta={[{ property: "og:title", content: "Помилки реєстру" }]}
    />
    <BackLink onClick={() => router.push("/registers")}>
      Повернутися до переліку файлів
    </BackLink>
    <Line />
    <ol>
      {register.errors &&
        register.errors.map((item, key) => (
          <li className={styles.li} key={key}>
            {item}
          </li>
        ))}
    </ol>
  </div>
);

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) =>
      dispatch(
        fetchRegisters({
          id
        })
      )
  }),
  connect((state, location) => ({
    register: getRegisters(state, [location.params.id])[0]
  }))
)(RegistersErrorsPage);
