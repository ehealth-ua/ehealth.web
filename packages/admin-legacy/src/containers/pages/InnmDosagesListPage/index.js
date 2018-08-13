import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/Button";
import DictionaryValue from "../../blocks/DictionaryValue";

import Table from "../../../components/Table";
import ShowBy from "../../blocks/ShowBy";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getInnmDosages } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchInnmDosages } from "./redux";

import { ThinAddIcon, CheckRightIcon } from "@ehealth/icons";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти лікарську форму",
    filters: [
      {
        name: "id",
        title: "За ідентифікатором",
        validate: uuidValidate
      },
      { name: "name", title: "За назвою" }
    ]
  }
];

const InnmDosagesListPage = ({ innm_dosages = [], paging, location }) => (
  <div id="innm-dosages-list-page">
    <Helmet
      title="Лікарські форми"
      meta={[{ property: "og:title", content: "Лікарські форми" }]}
    />
    <ListHeader
      button={
        <Button
          to="/innm-dosages/create"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Створити лікарську форму
        </Button>
      }
    >
      <H1>Лікарські форми</H1>
    </ListHeader>

    <div>
      <H2>Знайти лікарську форму</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="innm-dosages-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Назва" },
          { key: "form", title: "Форма" },
          { key: "active", title: "Активна" },
          { key: "action", title: "Деталі /Деактивація", width: 150 }
        ]}
        data={innm_dosages.map(item => ({
          id: <div>{item.id}</div>,
          name: <div>{item.name}</div>,
          form: (
            <div>
              <DictionaryValue dictionary="MEDICATION_FORM" value={item.form} />
            </div>
          ),
          active: <div>{item.is_active && <CheckRightIcon width="14" />}</div>,
          action: (
            <Button
              id={`show-innm-dosages-detail-button-${item.id}`}
              theme="link"
              to={`/innm-dosages/${item.id}`}
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
      dispatch(fetchInnmDosages({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.InnmDosagesListPage,
    innm_dosages: getInnmDosages(
      state,
      state.pages.InnmDosagesListPage.innm_dosages
    )
  }))
)(InnmDosagesListPage);
