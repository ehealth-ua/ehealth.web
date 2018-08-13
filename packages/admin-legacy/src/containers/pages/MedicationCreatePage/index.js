import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

import BackLink from "../../blocks/BackLink";
import Line from "../../../components/Line";
import MedicationsCreateForm from "../../forms/MedicationsCreateForm";
import { getInnmDosages, getDictionary } from "../../../reducers";

import { onSubmit, onSearchInnmsDosages } from "./redux";

class MedicationCreatePage extends React.Component {
  render() {
    const {
      router,
      innm_dosages = [],
      medication_unit = [],
      medication_form = [],
      countries = [],
      onSubmit = () => {},
      onSearchInnmsDosages = () => {}
    } = this.props;

    return (
      <div id="medicaion-create-page">
        <Helmet
          title="Створення торгівельного найменування"
          meta={[
            {
              property: "og:title",
              content: "Створення торгівельного найменування"
            }
          ]}
        />
        <BackLink onClick={() => router.goBack()}>
          Додати торгівельне найменування
        </BackLink>
        <Line />

        <MedicationsCreateForm
          onSubmit={onSubmit}
          onSearchInnmsDosages={onSearchInnmsDosages}
          data={{ innm_dosages, medication_unit, medication_form, countries }}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      innm_dosages: getInnmDosages(
        state,
        state.pages.MedicationCreatePage.innm_dosages
      ),
      medication_unit: getDictionary(state, "MEDICATION_UNIT"),
      medication_form: getDictionary(state, "MEDICATION_FORM"),
      countries: getDictionary(state, "COUNTRY")
    }),
    { onSubmit, onSearchInnmsDosages }
  )
)(MedicationCreatePage);
