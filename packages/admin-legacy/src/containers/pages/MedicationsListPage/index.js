import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/Button";

import Table from "../../../components/Table";
import ShowBy from "../../blocks/ShowBy";
import DictionaryValue from "../../blocks/DictionaryValue";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getMedications } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchMedications } from "./redux";

import { ThinAddIcon, CheckRightIcon } from "@ehealth/icons";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти торгівельне найменування",
    filters: [
      { name: "id", title: "за ID", validate: uuidValidate },
      {
        name: "innm_dosage_id",
        title: "за ID лікарської форми",
        validate: uuidValidate
      },
      { name: "innm_dosage_name", title: "за назвою лікарської форми" },
      { name: "name", title: "за назвою" }
    ]
  }
];

const MedicationsListPage = ({ medications = [], paging, location }) => (
  <div id="medication-list-page">
    <Helmet
      title="Торгівельні найменування"
      meta={[{ property: "og:title", content: "Торгівельні найменування" }]}
    />

    <ListHeader
      button={
        <Button
          to="/medications/create"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Створити торгівельне найменування
        </Button>
      }
    >
      <H1>Торгівельні найменування</H1>
    </ListHeader>

    <div>
      <H2>Пошук торгівельного найменування</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="medication-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "innm_dosage_id", title: "ID лікарської форми" },
          { key: "name", title: "Торгівельне найменування" },
          { key: "form", title: "Форма /Виробник" },
          { key: "active", title: "Активна" },
          { key: "action", title: "Детально / Деактивація", width: 200 }
        ]}
        data={medications.map(item => ({
          id: <div>{item.id}</div>,
          innm_dosage_id: (
            <div>{item.ingredients.filter(i => i.is_primary)[0].id}</div>
          ),
          name: <div>{item.name}</div>,
          form: (
            <div>
              <DictionaryValue dictionary="MEDICATION_FORM" value={item.form} />
              <br />
              {item.manufacturer.name}
            </div>
          ),
          active: <div>{item.is_active && <CheckRightIcon width="14" />}</div>,
          action: (
            <Button
              id={`show-medication-detail-button-${item.id}`}
              theme="link"
              to={`/medications/${item.id}`}
            >
              Детально
            </Button>
          )
        }))}
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
      dispatch(fetchMedications({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.MedicationsListPage,
    medications: getMedications(
      state,
      state.pages.MedicationsListPage.medications
    )
  }))
)(MedicationsListPage);
