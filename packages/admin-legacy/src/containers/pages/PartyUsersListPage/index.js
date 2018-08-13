import React from "react";
import { compose } from "redux";
import { provideHooks } from "redial";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";

import ShowBy from "../../blocks/ShowBy";
import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getPartyUsers } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchPartyUsers } from "./redux";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти обліковий запис",
    filters: [
      { name: "user_id", title: "За ID користувача", validate: uuidValidate },
      { name: "party_id", title: "За ID особи", validate: uuidValidate }
    ]
  }
];

const PartyUsersListPage = ({ party_users = [], paging, location }) => (
  <div id="party-users-list-page">
    <Helmet
      title="Облікові записи"
      meta={[{ property: "og:title", content: "Облікові записи" }]}
    />
    <ListHeader>
      <H1>Облікові записи</H1>
    </ListHeader>

    <div>
      <H2>Пошук облікового запису</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="party-users-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "user_id", title: "ID користувача" },
          { key: "party_id", title: "ID особи" },
          { key: "name", title: "Ім'я" },
          { key: "birth_date", title: "Дата народження" }
        ]}
        data={party_users.map(
          ({
            id,
            user_id,
            party_id,
            last_name,
            first_name,
            second_name,
            birth_date
          }) => ({
            id,
            user_id,
            party_id,
            name: `${last_name} ${first_name} ${second_name}`,
            birth_date
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
      dispatch(fetchPartyUsers({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.PartyUsersListPage,
    party_users: getPartyUsers(state, state.pages.PartyUsersListPage.partyUsers)
  }))
)(PartyUsersListPage);
