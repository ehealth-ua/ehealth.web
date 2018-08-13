import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { H1 } from "../../../components/Title";
import { ListPagination } from "../../../components/List";
import Pagination from "../../../components/CursorPagination";

import BackLink from "../../blocks/BackLink";
import ClinicsList from "../../blocks/ClinicsList";
import ShowBy from "../../blocks/ShowBy";

import { getClinics } from "../../../reducers";

import { fetchClinics } from "./redux";

const ClinicsVerificationListPage = ({ clinics = [], paging, location }) => (
  <div id="clinics-verification-list-page">
    <Helmet
      title="Перевірка медичних закладiв"
      meta={[{ property: "og:title", content: "Перевірка медичних закладiв" }]}
    />

    <BackLink to="/clinics-verification" detached>
      Повернутися до сторінки пошуку
    </BackLink>

    <H1>Перевірка медичних закладiв</H1>

    <ShowBy location={location} />

    <ClinicsList clinics={clinics} />

    {paging.cursors && (
      <ListPagination>
        <Pagination
          location={location}
          after={paging.cursors.starting_after}
          before={paging.cursors.ending_before}
        />
      </ListPagination>
    )}
  </div>
);

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchClinics({ ...query, nhs_verified: false }))
  }),
  connect(
    state => ({
      ...state.pages.ClinicsListPage,
      clinics: getClinics(state, state.pages.ClinicsListPage.clinics)
    }),
    { fetchClinics }
  )
)(ClinicsVerificationListPage);
