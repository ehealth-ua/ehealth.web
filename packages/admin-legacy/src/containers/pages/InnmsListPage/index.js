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

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getInnms } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchInnms } from "./redux";

import { ThinAddIcon, CheckRightIcon } from "@ehealth/icons";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти МНН",
    filters: [
      { name: "id", title: "За ідентифікатором", validate: uuidValidate },
      { name: "sctid", title: "За sctid" },
      { name: "name", title: "За назвою" },
      { name: "name_original", title: "За оригінальною назвою" }
    ]
  }
];

const InnmsListPage = ({ innms = [], paging, location }) => (
  <div id="innms-list-page">
    <Helmet title="МНН" meta={[{ property: "og:title", content: "МНН" }]} />

    <ListHeader
      button={
        <Button
          to="/innms/create"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Cтворити МНН
        </Button>
      }
    >
      <H1>МНН</H1>
    </ListHeader>

    <div>
      <H2>Пошук МНН</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="innms-table">
      <Table
        columns={[
          { key: "id", title: "id" },
          { key: "name", title: "Назва МНН" },
          { key: "name_original", title: "Оригінальна назва МНН" },
          { key: "sctid", title: "SCTID" },
          { key: "active", title: "Активна" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={innms.map(item => ({
          id: <div>{item.id}</div>,
          name: <div>{item.name}</div>,
          name_original: <div>{item.name_original}</div>,
          sctid: <div>{item.sctid ? item.sctid : "-"}</div>,
          active: <div>{item.is_active && <CheckRightIcon width="14" />}</div>,
          action: (
            <Button
              id={`show-innm-detail-button-${item.id}`}
              theme="link"
              to={`/innms/${item.id}`}
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
      dispatch(fetchInnms({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.InnmsListPage,
    innms: getInnms(state, state.pages.InnmsListPage.innms)
  }))
)(InnmsListPage);
