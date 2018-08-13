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

import DictionaryValue from "../../blocks/DictionaryValue";

import { getEmployees, getDictionaryValues } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchEmployees } from "./redux";

const EmployeesListPage = ({
  employees = [],
  status = [],
  paging = {},
  location
}) => (
  <div id="employees-list-page">
    <Helmet
      title="Співробітники"
      meta={[{ property: "og:title", content: "Співробітники" }]}
    />

    <H1>Співробітники</H1>

    <SearchForm
      fields={[
        {
          component: SearchFilterField,
          labelText: "Знайти співробітника",
          filters: [
            {
              name: "party_id",
              title: "За party ID",
              validate: uuidValidate
            },
            { name: "edrpou", title: "За ЄДРПОУ" },
            {
              name: "legal_entity_id",
              title: "За ID юридичної особи",
              validate: uuidValidate
            },
            {
              name: "division_id",
              title: "За ID підрозділу",
              validate: uuidValidate
            }
          ]
        },
        {
          component: SelectFilterField,
          title: "Фільтрувати за статусом",
          name: "status",
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

    <ListTable id="employees-table">
      <Table
        columns={[
          { key: "date", title: "Дата реєстрації" },
          { key: "name", title: "Ім'я працівника" },
          { key: "position", title: "Позиція" },
          { key: "legalEntity", title: "Юридична/Фізична особа" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={employees.map(item => ({
          key: item.id,
          date: format(item.start_date, "DD/MM/YYYY"),
          name: (
            <div>
              {item.party.last_name} {item.party.first_name}
              <br />
              {item.party.second_name}
            </div>
          ),
          position: (
            <DictionaryValue dictionary="POSITION" value={item.position} />
          ),
          legalEntity: (
            <div>
              <p>{item.legal_entity.name}</p>
              <small>ЕДРПОУ {item.legal_entity.edrpou}</small>
            </div>
          ),
          action: (
            <Button
              id={`show-employees-detail-button-${item.id}`}
              theme="link"
              to={`/employees/${item.id}`}
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
      dispatch(fetchEmployees({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.EmployeesListPage,
    employees: getEmployees(state, state.pages.EmployeesListPage.employees),
    status: getDictionaryValues(state, "EMPLOYEE_STATUS")
  }))
)(EmployeesListPage);
