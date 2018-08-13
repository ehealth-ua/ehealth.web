import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import InnmForm from "../../forms/InnmForm";
import BackLink from "../../blocks/BackLink";
import Line from "../../../components/Line";

import { createInnm } from "../../../redux/innms";

class InnmCreatePage extends React.Component {
  render() {
    const { createInnm = () => {}, router } = this.props;

    return (
      <div id="innm-create-page">
        <Helmet
          title="Сторінка створення МНН"
          meta={[{ property: "og:title", content: "Сторінка створення МНН" }]}
        />
        <BackLink onClick={() => router.goBack()}>
          Повернутися до списку МНН
        </BackLink>
        <Line />

        <H1>Сторінка створення МНН</H1>

        <InnmForm
          create
          onSubmit={v =>
            createInnm(v).then(({ error, payload }) => {
              if (!error) router.push(`/innms/${payload.data.id}`);
            })
          }
        />
      </div>
    );
  }
}

export default compose(withRouter, connect(null, { createInnm }))(
  InnmCreatePage
);
