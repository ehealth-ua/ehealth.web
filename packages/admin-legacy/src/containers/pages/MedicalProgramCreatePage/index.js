import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import MedicalProgramCreateForm from "../../forms/MedicalProgramCreateForm";
import BackLink from "../../blocks/BackLink";
import Line from "../../../components/Line";

import { createMedicalProgram } from "../../../redux/medical-programs";

class MedicalProgramCreatePage extends React.Component {
  render() {
    const { createMedicalProgram = () => {}, router } = this.props;

    return (
      <div id="innm-create-page">
        <Helmet
          title="Сторінка створення Медичної Програми"
          meta={[
            {
              property: "og:title",
              content: "Сторінка створення Медичної Програми"
            }
          ]}
        />
        <BackLink onClick={() => router.goBack()}>
          Повернутися до списку Медичних Програм
        </BackLink>
        <Line />

        <H1>Програми</H1>

        <MedicalProgramCreateForm
          create
          onSubmit={v =>
            createMedicalProgram(v).then(({ payload, error }) => {
              if (error) return;
              return router.push(`/medical-programs/${payload.data.id}`);
            })
          }
        />
      </div>
    );
  }
}

export default compose(withRouter, connect(null, { createMedicalProgram }))(
  MedicalProgramCreatePage
);
