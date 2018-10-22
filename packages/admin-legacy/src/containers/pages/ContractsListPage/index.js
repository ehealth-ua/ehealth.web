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
import DateFilterField from "../../forms/DateFilterField";
import CheckboxFilterField from "../../forms/CheckboxFilterField";

import { getContracts } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";
import { CONTRACT_STATUS } from "../../../helpers/enums";
import { fetchContracts } from "./redux";

const DATE_FORMAT = "DD.MM.YYYY";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    filters: [
      {
        name: "id",
        title: "За ID",
        validate: uuidValidate
      },
      {
        name: "contract_number",
        title: "За номером договору"
      },
      {
        name: "contractor_legal_entity_id",
        title: "За ID надавача",
        validate: uuidValidate
      }
    ]
  },
  {
    component: CheckboxFilterField,
    title: "Призупинений",
    name: "is_suspended",
    fullWidth: true
  },
  {
    component: SearchFilterField,
    detailed: true,
    hasSelect: false,
    labelText: "ID договору",
    placeholder: "Введіть ID",
    filters: [
      {
        name: "id",
        validate: uuidValidate
      }
    ]
  },
  {
    component: SearchFilterField,
    detailed: true,
    hasSelect: false,
    labelText: "За номером договору",
    placeholder: "Введіть номер",
    filters: [
      {
        name: "contract_number"
      }
    ]
  },
  {
    component: SearchFilterField,
    detailed: true,
    hasSelect: false,
    labelText: "За ID надавача",
    placeholder: "Введіть ID надавача",
    filters: [
      {
        name: "contractor_legal_entity_id",
        validate: uuidValidate
      }
    ]
  },
  {
    component: SearchFilterField,
    detailed: true,
    hasSelect: false,
    labelText: "ЄДРПОУ",
    placeholder: "Введіть ЄДРПОУ",
    filters: [
      {
        name: "edrpou"
      }
    ]
  },
  {
    component: SelectFilterField,
    labelText: "Статус",
    placeholder: "Веріфікований/Завершений",
    name: "status",
    options: [
      { title: "Веріфікований", name: "VERIFIED" },
      { title: "Завершений", name: "TERMINATED" }
    ],
    detailed: true
  },
  {
    component: DateFilterField,
    detailed: true,
    filters: [
      {
        name: "date_from_start_date",
        labelText: "Дата початку дії договору",
        placeholder: "з 01.01.1990"
      },
      {
        name: "date_to_start_date",
        placeholder: "по 01.01.1990"
      }
    ]
  },

  {
    component: DateFilterField,
    detailed: true,
    filters: [
      {
        name: "date_from_end_date",
        labelText: "Кінцева дата дії договору",
        placeholder: "з 01.01.1990"
      },
      {
        name: "date_to_end_date",
        placeholder: "по 01.01.1990"
      }
    ]
  }
];

const ContractsListPage = ({ contracts = [], paging = {}, location }) => (
  <div id="contracts-list-page">
    <Helmet
      title="Перелік договорів"
      meta={[{ property: "og:title", content: "Перелік договорів" }]}
    />

    <H1>Перелік договорів</H1>

    <div>
      <H2>Пошук договорів</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="contracts-table">
      <Table
        columns={[
          {
            key: "id",
            title: "ID договору"
          },
          {
            key: "legalEntityId",
            title: "ID надавача"
          },
          {
            key: "contractNumber",
            title: "Номер договору"
          },
          {
            key: "startDate",
            title: "Діє з",
            width: 105
          },
          {
            key: "endDate",
            title: "Діє по",
            width: 105
          },
          {
            key: "suspended",
            title: "Дія договору"
          },
          { key: "status", title: "Статус" },
          { key: "action", title: "Дія", width: 100 }
        ]}
        data={contracts.map(
          ({
            id,
            contract_id,
            contract_number,
            contractor_legal_entity_id,
            start_date,
            end_date,
            status,
            is_suspended
          }) => ({
            id,
            legalEntityId: contractor_legal_entity_id,
            contractNumber: contract_number,
            startDate: format(start_date, DATE_FORMAT),
            endDate: format(end_date, DATE_FORMAT),
            suspended: is_suspended && "Призупинено",
            status: status && (
              <ColoredText color={CONTRACT_STATUS[status].color}>
                {CONTRACT_STATUS[status].title}
              </ColoredText>
            ),
            action: (
              <Button
                id={`show-contract-detail-button-${id}`}
                theme="link"
                to={`/contracts/${id}`}
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
      dispatch(fetchContracts({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.ContractsListPage,
    contracts: getContracts(state, state.pages.ContractsListPage.contracts)
  }))
)(ContractsListPage);
