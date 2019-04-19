import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";
import format from "date-fns/format";

import { H1, H2 } from "../../../components/Title";
import { ListShowBy, ListTable } from "../../../components/List";
import Table from "../../../components/Table";
import ColoredText from "../../../components/ColoredText";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

import ShowBy from "../../blocks/ShowBy";
import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getDeclarations } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchDeclarations } from "./redux";

const PendingDeclarationsListPage = ({
  declarations = [],
  paging = {},
  location
}) => (
  <div id="pending-declarations-list-page">
    <Helmet
      title="Декларації на розгляді"
      meta={[{ property: "og:title", content: "Декларації на розгляді" }]}
    />

    <H1>Декларації на розгляді</H1>

    <div>
      <H2>Шукати декларацію</H2>
      <SearchForm
        fields={[
          {
            component: SearchFilterField,
            labelText: "Знайти декларацію",
            filters: [
              {
                name: "employee_id",
                title: "За ідентифікатором працівника",
                validate: uuidValidate
              },
              {
                name: "legal_entity_id",
                title: "За ID юридичної особи",
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

    <ListTable id="declarations-table">
      <Table
        columns={[
          { key: "person", title: "Людина" },
          { key: "legalEntity", title: "Юридична/Фізична особа" },
          { key: "dates", title: "Дати", width: 150 },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={declarations.map(item => ({
          person: item.person ? (
            <div>
              {`${item.person.last_name} ${item.person.first_name}`}
              <div>{item.person.second_name}</div>
            </div>
          ) : (
            "-"
          ),
          legalEntity: item.legal_entity ? (
            <div>
              {item.legal_entity.name}
              <br />
              <ColoredText color="gray">
                ЕДРПОУ: {item.legal_entity.edrpou}
              </ColoredText>
            </div>
          ) : (
            "-"
          ),
          dates: `${format(item.start_date, "DD.MM.YYYY hh:mm")} – ${format(
            item.end_date,
            "DD.MM.YYYY hh:mm"
          )}`,
          action: (
            <Button
              id={`show-declaration-detail-button-${item.id}`}
              theme="link"
              to={`/pending-declarations/${item.id}`}
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
    fetch: ({ dispatch, location: { query } }) => {
      if (query.employee_id || query.legal_entity_id)
        return dispatch(
          fetchDeclarations({
            page_size: 5,
            status: "pending_verification",
            reason: "no_tax_id",
            ...query
          })
        );
    }
  }),
  connect(state => ({
    ...state.pages.PendingDeclarationsListPage,
    declarations: getDeclarations(
      state,
      state.pages.PendingDeclarationsListPage.declarations
    )
  }))
)(PendingDeclarationsListPage);
