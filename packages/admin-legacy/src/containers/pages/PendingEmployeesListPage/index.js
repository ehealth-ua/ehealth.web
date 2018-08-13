import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";
import format from "date-fns/format";

import { H1 } from "../../../components/Title";
import { ListShowBy, ListTable } from "../../../components/List";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

import ShowBy from "../../blocks/ShowBy";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import SelectFilterField from "../../forms/SelectFilterField";
import CheckboxFilterField from "../../forms/CheckboxFilterField";

import { getEmployeesRequests, getDictionaryValues } from "../../../reducers";

import { fetchEmployeesRequest } from "./redux";

const PendingEmployeesListPage = ({
  employees = [],
  status = [],
  paging = {},
  location
}) => (
  <div id="pending-employees-list-page">
    <Helmet
      title="Cпівробітники на розгляді"
      meta={[{ property: "og:title", content: "Cпівробітники на розгляді" }]}
    />

    <H1>Cпівробітники на розгляді</H1>

    <SearchForm
      fields={[
        {
          component: SearchFilterField,
          labelText: "Знайти співробітника",
          filters: [
            { name: "edrpou", title: "За ЄДРПОУ" },
            { name: "legal_entity_name", title: "За назвою юр. особи" },
            { name: "id", title: "За ID" }
          ]
        },
        {
          component: SelectFilterField,
          title: "Фільтрувати за назвою",
          name: "status",
          defaultValue: "NEW",
          options: status.map(({ key, value }) => ({ name: key, title: value }))
        },
        {
          component: CheckboxFilterField,
          title: "Без ІПН",
          name: "no_tax_id"
        }
      ]}
      location={location}
    />

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="pending-employees-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "date", title: "Дата реєстрації" },
          { key: "name", title: "Ім'я працівника" },
          { key: "legalEntity", title: "Юридична/Фізична особа" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={employees.map(item => ({
          key: item.id,
          id: item.id,
          date: format(item.inserted_at, "DD/MM/YYYY"),
          name: (
            <div>
              {item.last_name} {item.first_name}
              <br />
              {item.second_name}
            </div>
          ),
          legalEntity: (
            <div>
              <p>{item.legal_entity_name}</p>
              <small>ЕДРПОУ {item.edrpou}</small>
            </div>
          ),
          action: (
            <Button
              id={`show-employees-detail-button-${item.id}`}
              theme="link"
              to={`/pending-employees/${item.id}`}
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
      dispatch(fetchEmployeesRequest({ page_size: 5, status: "NEW", ...query }))
  }),
  connect(state => ({
    ...state.pages.PendingEmployeesListPage,
    employees: getEmployeesRequests(
      state,
      state.pages.PendingEmployeesListPage.employeesRequests
    ),
    status: getDictionaryValues(state, "EMPLOYEE_REQUEST_STATUS")
  }))
)(PendingEmployeesListPage);
