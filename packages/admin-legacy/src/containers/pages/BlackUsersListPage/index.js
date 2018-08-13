import React from "react";
import { compose } from "redux";
import { provideHooks } from "redial";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import { H1, H2 } from "../../../components/Title";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import ColoredText from "../../../components/ColoredText";

import ShowBy from "../../blocks/ShowBy";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import SelectFilterField from "../../forms/SelectFilterField";

import { getBlackUsers } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchBlackListUsers } from "./redux";

import { ThinAddIcon } from "@ehealth/icons";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти користувача",
    placeholder: "Знайти користувача",
    filters: [
      {
        name: "id",
        title: "За ID",
        validate: uuidValidate
      },
      { name: "tax_id", title: "За ІНН" }
    ]
  },
  {
    component: SelectFilterField,
    title: "Активні/Неактивні",
    name: "is_active",
    options: [
      { title: "Активні", name: "true" },
      { title: "Неактивні", name: "false" }
    ]
  }
];

const BlackUsersListPage = ({ black_list_users = [], paging, location }) => (
  <div id="black-list-users-list-page">
    <Helmet
      title="Заблоковані користувачі"
      meta={[{ property: "og:title", content: "Заблоковані користувачі" }]}
    />
    <ListHeader
      button={
        <Button
          to="/black-list-users/create"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Додати користувача
        </Button>
      }
    >
      <H1>Заблоковані користувачі</H1>
    </ListHeader>

    <div>
      <H2>Пошук користувача</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="black-list-users-table">
      <Table
        columns={[
          { key: "id", title: "ID" },
          { key: "tax_id", title: "ID ІНН" },
          { key: "status", title: "Статус" },
          {
            key: "action",
            title: "Детально / Деактивація",
            width: 200
          }
        ]}
        data={black_list_users.map(({ id, tax_id, is_active }) => ({
          id,
          tax_id,
          status: (
            <div>
              {is_active ? (
                <ColoredText color="green">активна</ColoredText>
              ) : (
                <ColoredText color="red">неактивна</ColoredText>
              )}
            </div>
          ),
          action: (
            <Button
              id={`show-black-list-users-detail-button-${id}`}
              theme="link"
              to={`/black-list-users/${id}`}
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
      dispatch(fetchBlackListUsers({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.BlackUsersListPage,
    black_list_users: getBlackUsers(
      state,
      state.pages.BlackUsersListPage.blackListUsers
    )
  }))
)(BlackUsersListPage);
