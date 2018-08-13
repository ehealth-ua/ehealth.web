import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { H3 } from "../../../components/Title";
import BackLink from "../../blocks/BackLink";
import ProgramMedicationCreateForm from "../../forms/ProgramMedicationCreateForm";

import { onCreate, fetchMedicalPrograms } from "./redux";

class ProgramMedicationCreatePage extends React.Component {
  render() {
    const { medical_programs = {}, onCreate = () => {} } = this.props;

    return (
      <div id="program-medication-update-page">
        <Helmet
          title="Створення учасника медичної програми"
          meta={[
            {
              property: "og:title",
              content: "Створення учасника медчної програми"
            }
          ]}
        />

        <BackLink onClick={() => this.props.router.goBack()}>
          Повернутись до деталей
        </BackLink>
        <H3>Створення учасника медичної програми</H3>
        <ProgramMedicationCreateForm
          onSubmit={onCreate}
          data={medical_programs || []}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(
        fetchMedicalPrograms({ page_size: 100, is_active: true, ...query })
      )
  }),
  connect(
    (state, { params: { id } }) => ({
      medical_programs: state.data.medical_programs
    }),
    { onCreate }
  )
)(ProgramMedicationCreatePage);
