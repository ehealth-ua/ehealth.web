import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";
import format from "date-fns/format";

import { H1, H2 } from "../../../components/Title";
import { ListTable, ListShowBy } from "../../../components/List";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

import ShowBy from "../../blocks/ShowBy";
import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import DateFilterField from "../../forms/DateFilterField";

import { getPersons } from "../../../reducers";
import required from "../../../helpers/validators/required-validate";
import normalizePhone from "../../../helpers/phone-normalize";

import { fetchPersonsList } from "./redux";

const DATE_FORMAT = "DD.MM.YYYY";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Прізвище",
    placeholder: "Прізвище особи",
    requiredStar: true,
    hasSelect: false,
    filters: [
      {
        name: "last_name",
        validate: required
      }
    ]
  },
  {
    component: SearchFilterField,
    labelText: "Ім'я",
    placeholder: "Ім'я особи",
    hasSelect: false,
    requiredStar: true,
    filters: [
      {
        name: "first_name",
        validate: required
      }
    ]
  },
  {
    component: SearchFilterField,
    labelText: "По-батькові",
    placeholder: "По-батькові особи",
    hasSelect: false,
    filters: [
      {
        name: "second_name"
      }
    ]
  },
  {
    component: DateFilterField,
    requiredStar: true,
    filters: [
      {
        name: "birth_date",
        labelText: "Дата народження",
        placeholder: "01.01.1990",
        validate: required
      }
    ]
  },
  {
    component: SearchFilterField,
    labelText: "ІНН",
    placeholder: "ІНН особи",
    hasSelect: false,
    filters: [
      {
        name: "tax_id"
      }
    ]
  },
  {
    component: SearchFilterField,
    labelText: "Номер мобільного телефону",
    hasSelect: false,
    prefix: "+380",
    normalize: normalizePhone,
    filters: [
      {
        name: "mobile_phone"
      }
    ]
  }
];

const PersonSearchPage = ({ persons = [], paging = {}, location }) => (
  <div id="persons-list-page">
    <Helmet
      title="Пошук осіб"
      meta={[{ property: "og:title", content: "Пошук осіб" }]}
    />

    <H1>Пошук осіб</H1>

    <div>
      <H2>Пошук особи</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <div>
      <ListShowBy>
        <ShowBy location={location} />
      </ListShowBy>

      <ListTable id="persons-table">
        <Table
          columns={[
            { key: "id", title: "ID" },
            { key: "person", title: "ПІБ" },
            { key: "birth_date", title: " Дата народження" },
            { key: "tax_id", title: "ІНН" },
            { key: "mobile_phone", title: "Телефон" },
            { key: "birth_settlements", title: "Місце народження" },
            { key: "action", title: "Декларації" }
          ]}
          data={persons.map(
            ({
              id,
              first_name,
              last_name,
              second_name = "",
              birth_date,
              tax_id = "?",
              mobile_phone = "?",
              birth_settlements = "?"
            }) => ({
              id,
              person: <div>{`${first_name} ${last_name} ${second_name}`}</div>,
              birth_date: <div>{format(birth_date, DATE_FORMAT)}</div>,
              tax_id,
              mobile_phone,
              birth_settlements,
              action: (
                <Button
                  id={`show-declaration-detail-button-${id}`}
                  theme="link"
                  to={`/declarations/?person_id=${id}`}
                >
                  Декларації
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
  </div>
);

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      query.first_name &&
      query.last_name &&
      query.birth_date &&
      dispatch(
        fetchPersonsList({
          page_size: 5,
          ...query
        })
      )
  }),
  connect(state => ({
    ...state.pages.PersonSearchPage,
    persons: getPersons(state, state.pages.PersonSearchPage.persons)
  }))
)(PersonSearchPage);
