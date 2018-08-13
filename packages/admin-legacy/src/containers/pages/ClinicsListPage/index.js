import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { ListShowBy } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";

import ClinicsList from "../../blocks/ClinicsList";
import ShowBy from "../../blocks/ShowBy";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getClinics } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchClinics } from "./redux";

const ClinicsListPage = ({ clinics = [], paging, location }) => (
  <div id="clinics-list-page">
    <Helmet
      title="Медичні заклади"
      meta={[{ property: "og:title", content: "Медичні заклади" }]}
    />

    <H1>Медичні заклади</H1>

    <div>
      <H2>Шукати медичний заклад</H2>

      <SearchForm
        fields={[
          {
            component: SearchFilterField,
            labelText: "Знайти медичний заклад",
            filters: [
              { name: "edrpou", title: "За ЄДРПОУ" },
              {
                name: "legal_entity_id",
                title: "За ID юридичної особи",
                validate: uuidValidate
              },
              {
                name: "settlement_id",
                title: "За ID міста",
                validate: uuidValidate
              }
            ]
          }
        ]}
        location={location}
      />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ClinicsList clinics={clinics} />

    {paging.total_pages > 1 && (
      <Pagination
        currentPage={paging.page_number}
        totalPage={paging.total_pages}
        location={location}
        cb={() => {}}
      />
    )}
  </div>
);

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchClinics({ page_size: 5, ...query }))
  }),
  connect(
    state => ({
      ...state.pages.ClinicsListPage,
      clinics: getClinics(state, state.pages.ClinicsListPage.clinics)
    }),
    { fetchClinics }
  )
)(ClinicsListPage);
