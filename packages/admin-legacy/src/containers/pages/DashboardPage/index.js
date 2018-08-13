import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";

import { fetchConfiguration } from "../../../redux/configuration";
import { getGlobalSatistic, getConfiguration } from "../../../reducers";

import { fetchGlobalStat } from "./redux";
import styles from "./styles.module.css";

class DashboardPage extends React.Component {
  render() {
    const { globalStatistic, configuration: { bi_url } } = this.props;

    return (
      <div id="dashboard-page">
        <Helmet
          title="Статистика"
          meta={[{ property: "og:title", content: "Статистика" }]}
        />

        <H1>Статистика</H1>

        <div className={styles.global}>
          <div>
            <div className={styles.count}>{globalStatistic.declarations}</div>
            Декларації
          </div>
          <div>
            <div className={styles.count}>{globalStatistic.doctors}</div>
            Лікарі
          </div>
          <div>
            <div className={styles.count}>{globalStatistic.msps}</div>
            Провайдери медичної системи
          </div>
        </div>

        {bi_url && (
          <iframe
            src={bi_url}
            title="iframe"
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch }) =>
      Promise.all([dispatch(fetchGlobalStat()), dispatch(fetchConfiguration())])
  }),
  connect(state => ({
    globalStatistic: getGlobalSatistic(state),
    configuration: getConfiguration(state)
  }))
)(DashboardPage);
