import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";
import format from "date-fns/format";

import { H1, H2 } from "../../../components/Title";
import { ListTable, ListShowBy } from "../../../components/List";
import Table from "../../../components/Table";
import ColoredText from "../../../components/ColoredText";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

import ShowBy from "../../blocks/ShowBy";
import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import SelectFilterField from "../../forms/SelectFilterField";

import { getDeclarations } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchDeclarations } from "./redux";

const DATE_FORMAT = "DD.MM.YYYY hh:mm";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти декларацію",
    filters: [
      {
        name: "person_id",
        title: "За ID пацієнта",
        validate: uuidValidate
      },
      {
        name: "employee_id",
        title: "За ID працівника",
        validate: uuidValidate
      },
      {
        name: "legal_entity_id",
        title: "За ID юридичної особи",
        validate: uuidValidate
      }
    ]
  },
  {
    component: SelectFilterField,
    labelText: "Статус",
    placeholder: "Активні/Розірвані/Закриті",
    name: "status",
    options: [
      { title: "Активні", name: "active" },
      { title: "Розірвані", name: "terminated" },
      { title: "Закриті", name: "closed" }
    ]
  }
];

const DeclarationsListPage = ({ declarations = [], paging = {}, location }) => (
  <div id="declarations-list-page">
    <Helmet
      title="Декларації"
      meta={[{ property: "og:title", content: "Декларації" }]}
    />

    <H1>Декларації</H1>

    <div>
      <H2>Шукати декларацію</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="declarations-table">
      <Table
        columns={[
          { key: "person", title: "Людина" },
          { key: "legalEntity", title: "Юридична/Фізична особа" },
          { key: "dates", title: "Дати", width: 150 },
          { key: "status", title: "Статус" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={declarations.map(
          ({
            id,
            person = {},
            legal_entity = {},
            start_date,
            end_date,
            status
          }) => ({
            person: person && (
              <div>
                {`${person.last_name} ${person.first_name} `}
                <br />
                {person.second_name}
              </div>
            ),
            legalEntity: (
              <div>
                {legal_entity && (
                  <div>
                    {legal_entity.name}
                    <br />
                    <ColoredText color="gray">
                      ЕДРПОУ: {legal_entity.edrpou}
                    </ColoredText>
                  </div>
                )}
              </div>
            ),
            dates: [
              format(start_date, DATE_FORMAT),
              format(end_date, DATE_FORMAT)
            ].join(" "),
            status,
            action: (
              <Button
                id={`show-declaration-detail-button-${id}`}
                theme="link"
                to={`/declarations/${id}`}
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
      dispatch(fetchDeclarations({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.DeclarationsListPage,
    declarations: getDeclarations(
      state,
      state.pages.DeclarationsListPage.declarations
    )
  }))
)(DeclarationsListPage);
