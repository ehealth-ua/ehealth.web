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
import { ListHeader } from "../../../components/List";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

import ShowBy from "../../blocks/ShowBy";
import DictionaryValue from "../../blocks/DictionaryValue";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";
import SelectFilterField from "../../forms/SelectFilterField";
import DateFilterField from "../../forms/DateFilterField";

import { getRegisters } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";
import { ENTITY_TYPE, REGISTER_STATUS } from "../../../helpers/enums";
import { fetchRegistersList } from "./redux";

import { ThinAddIcon } from "@ehealth/icons";

const DATE_FORMAT = "DD/MM/YYYY";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    placeholder: "Знайти файл",
    filters: [
      {
        name: "id",
        title: "За ID",
        validate: uuidValidate
      },
      { name: "file_name", title: "За назвою файлу" }
    ]
  },
  {
    component: SelectFilterField,
    labelText: "Тип файлу",
    placeholder: "Оберіть тип файлу",
    name: "type",
    detailed: true,
    options: [
      { title: "Реєстрація смерті", name: "DEATH_REGISTRATION" },
      { title: "Шахрайство", name: "FRAUD" }
    ]
  },
  {
    component: SelectFilterField,
    labelText: "Cтатус",
    placeholder: "Новий/В обробці/Оброблений",
    name: "status",
    detailed: true,
    options: [
      { title: "Новий", name: "NEW" },
      { title: "В обробці", name: "PROCESSING" },
      { title: "Оброблений", name: "PROCESSED" }
    ]
  },
  {
    component: DateFilterField,
    detailed: true,
    filters: [
      {
        name: "inserted_at_from",
        labelText: "Дата з",
        placeholder: "1990-01-01"
      },
      {
        name: "inserted_at_to",
        labelText: "Дата по",
        placeholder: "1990-01-01"
      }
    ]
  }
];

const RegistersPage = ({ registers = [], paging = {}, location }) => (
  <div id="files-list-page">
    <Helmet title="Файли" meta={[{ property: "og:title", content: "Файли" }]} />
    <ListHeader
      button={
        <Button
          to="/registers/upload"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Завантажити файл
        </Button>
      }
    >
      <H1>Перелік файлів</H1>
    </ListHeader>

    <div>
      <H2>Пошук файлу</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <div>
      <ListShowBy>
        <ShowBy location={location} />
      </ListShowBy>

      <ListTable id="files-table">
        <Table
          columns={[
            { key: "id", title: "ID Файлу" },
            { key: "inserted_at", title: "Дата додавання" },
            { key: "type", title: "Тип файлу" },
            { key: "file_name", title: "Назва файлу" },
            { key: "entity_type", title: "Тип суб'єкта" },
            { key: "qty", title: "Статистика", width: 150 },
            { key: "errors", title: "Помилки" },
            { key: "status", title: "Статус файлу" },
            { key: "action", title: "Дії" }
          ]}
          data={registers.map(
            ({
              id,
              file_name,
              inserted_at,
              status,
              entity_type,
              type,
              errors,
              qty: { errors: warnings, not_found, processed, total }
            }) => ({
              id,
              inserted_at: format(inserted_at, DATE_FORMAT),
              type: (
                <DictionaryValue
                  dictionary="REGISTER_TYPE"
                  value={type.toUpperCase()}
                />
              ),
              file_name,
              entity_type: ENTITY_TYPE[entity_type] || entity_type,
              qty: (
                <div>
                  {`Не знайдено: ${not_found}`}
                  <br />
                  {`Оброблено: ${processed}`}
                  <br />
                  {`Помилок: ${warnings}`}
                  <br />
                  {`Усьго записів: ${total}`}
                  <br />
                </div>
              ),
              status: (
                <ColoredText color={REGISTER_STATUS[status].color}>
                  <b>{REGISTER_STATUS[status].title}</b>
                </ColoredText>
              ),
              errors: errors && (
                <div>
                  {errors &&
                    errors.length && (
                      <div>
                        {errors.length}
                        <Button
                          id={`registers-errors-button-${id}`}
                          theme="link"
                          to={`/registers/${id}`}
                        >
                          Показати
                        </Button>
                      </div>
                    )}
                </div>
              ),
              action: (
                <Button
                  id={`show-registers-entries-button-${id}`}
                  theme="link"
                  to={`/registers-entries?register_id=${id}`}
                >
                  Деталі
                </Button>
              )
            })
          )}
        />
      </ListTable>
<<<<<<< HEAD
      {paging.total_pages > 1 && (
        <Pagination
          currentPage={paging.page_number}
          totalPage={paging.total_pages}
          location={location}
          cb={() => {}}
        />
      )}
=======
      <Pagination
        currentPage={paging.page_number}
        totalPages={paging.total_pages}
      />
>>>>>>> f082487... fix(admin): change call a Pagination component on list
    </div>
  </div>
);

export default compose(
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(
        fetchRegistersList({
          page_size: 10,
          ...query
        })
      )
  }),
  connect(state => ({
    ...state.pages.RegistersPage,
    registers: getRegisters(state, state.pages.RegistersPage.registers)
  }))
)(RegistersPage);
