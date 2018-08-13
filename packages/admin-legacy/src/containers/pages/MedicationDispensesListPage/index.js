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

import { getMedicationDispenses } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchMedicationDispenses } from "./redux";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти відпуск",
    filters: [
      { name: "id", title: "За ID", validate: uuidValidate },
      {
        name: "medication_request_id",
        title: "За ID рецепту",
        validate: uuidValidate
      },
      {
        name: "legal_entity_id",
        title: "За ID аптеки",
        validate: uuidValidate
      },
      {
        name: "division_id",
        title: "За ID підрозділу",
        validate: uuidValidate
      },
      { name: "status", title: "За статусом" },
      { name: "dispensed_at", title: "За датою відпуску" }
    ]
  },
  {
    component: DateFilterField,
    title: "За період",
    filters: [
      {
        name: "dispensed_from",
        title: "Початкова дата",
        placeholder: "2017-10-25"
      },
      {
        name: "dispensed_to",
        title: "Кінцева дата",
        placeholder: "2018-09-26"
      }
    ]
  }
];

const MedicationDispensesListPage = ({
  medication_dispenses = [],
  paging,
  location
}) => (
  <div id="medication-dispenses-list-page">
    <Helmet
      title="Відпуск рецептів"
      meta={[{ property: "og:title", content: "Відпуск рецептів" }]}
    />

    <ListHeader>
      <H1>Відпуски рецептів</H1>
    </ListHeader>

    <div>
      <H2>Пошук відпуску</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="medication-dispenses-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "medication_request_id", title: "ID рецепту" },
          { key: "legal_entity_id", title: "ID аптеки" },
          { key: "division_id", title: "ID підрозділу" },
          { key: "status", title: "Статус" },
          { key: "dispensed", title: "Дата відпуску" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={medication_dispenses.map(
          ({
            id,
            medication_request,
            legal_entity,
            division,
            status,
            dispensed_at
          }) => ({
            id,
            medication_request_id: medication_request.id,
            legal_entity_id: legal_entity.id,
            division_id: division.id,
            status,
            dispensed: format(dispensed_at, "DD/MM/YYYY"),
            action: (
              <Button
                id={`show-medication-dispense-detail-button-${id}`}
                theme="link"
                to={`/medication-dispenses/${id}`}
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
      dispatch(fetchMedicationDispenses({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.MedicationDispensesListPage,
    medication_dispenses: getMedicationDispenses(
      state,
      state.pages.MedicationDispensesListPage.medication_dispenses
    )
  }))
)(MedicationDispensesListPage);
