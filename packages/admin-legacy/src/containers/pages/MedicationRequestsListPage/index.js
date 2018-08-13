import React from "react";
import { compose } from "redux";
import { provideHooks } from "redial";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import format from "date-fns/format";

import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/Button";
import Table from "../../../components/Table";

import ShowBy from "../../blocks/ShowBy";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import DateFilterField from "../../forms/DateFilterField";

import { getMedicationRequests } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchMedicationRequests } from "./redux";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти рецепт",
    filters: [
      {
        name: "employee_id",
        title: "За ID працівника",
        validate: uuidValidate
      },
      { name: "person_id", title: "За ID пацієнта", validate: uuidValidate },
      { name: "status", title: "За статусом" },
      { name: "request_number", title: "За номером рецепту" },
      {
        name: "legal_entity_id",
        title: "За ID медичного закладу",
        validate: uuidValidate
      },
      {
        name: "medication_id",
        title: "За ID лікарської форми",
        validate: uuidValidate
      }
    ]
  },
  {
    component: DateFilterField,
    title: "За період",
    filters: [
      {
        name: "created_from",
        title: "Початкова дата",
        placeholder: "2017-10-25"
      },
      {
        name: "created_to",
        title: "Кінцева дата",
        placeholder: "2018-09-26"
      }
    ]
  }
];

const MedicationRequestsListPage = ({
  medication_requests = [],
  paging,
  location
}) => (
  <div id="medication-requests-list-page">
    <Helmet
      title="Рецепти"
      meta={[{ property: "og:title", content: "Рецепти" }]}
    />

    <ListHeader>
      <H1>Рецепти</H1>
    </ListHeader>

    <div>
      <H2>Пошук рецепту</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="medication-requests-table">
      <Table
        columns={[
          { key: "created_at", title: "Дата створення", width: 120 },
          { key: "id", title: "ID" },
          { key: "request_number", title: "Номер рецепту" },
          { key: "division_id", title: "ID підрозділу" },
          { key: "legal_entity_id", title: "ID медичного закладу" },
          { key: "medication_id", title: "ID лікарської форми", width: 110 },
          { key: "person_id", title: "ID пацієнта" },
          { key: "status", title: "Статус" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={medication_requests.map(
          ({
            created_at,
            id,
            request_number,
            legal_entity,
            division,
            medication_info: { medication_id },
            person,
            status
          }) => ({
            created_at: format(created_at, "DD/MM/YYYY"),
            id,
            request_number,
            division_id: division.id,
            legal_entity_id: legal_entity.id,
            medication_id,
            person_id: person.id,
            status,
            action: (
              <Button
                id={`show-medication-requests-detail-button-${id}`}
                theme="link"
                to={`/medication-requests/${id}`}
              >
                Детально
              </Button>
            )
          })
        )}
      />
    </ListTable>
    <Pagination
      currentPage={paging.page_number}
      totalPages={paging.total_pages}
    />
  </div>
);

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchMedicationRequests({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.MedicationRequestsListPage,
    medication_requests: getMedicationRequests(
      state,
      state.pages.MedicationRequestsListPage.medication_requests
    )
  }))
)(MedicationRequestsListPage);
