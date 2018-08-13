import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { provideHooks } from "redial";
import Helmet from "react-helmet";

import { H1, H2 } from "../../../components/Title";
import { ListHeader, ListShowBy, ListTable } from "../../../components/List";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/Button";
import DictionaryValue from "../../blocks/DictionaryValue";

import Table from "../../../components/Table";
import ShowBy from "../../blocks/ShowBy";
import ColoredText from "../../../components/ColoredText";

import SearchForm from "../../forms/SearchForm";
import SearchFilterField from "../../forms/SearchFilterField";

import { getProgramMedications } from "../../../reducers";
import uuidValidate from "../../../helpers/validators/uuid-validate";

import { fetchProgramMedications } from "./redux";

import { ThinAddIcon } from "@ehealth/icons";

const SEARCH_FIELDS = [
  {
    component: SearchFilterField,
    labelText: "Знайти учасника програми",
    filters: [
      {
        name: "medical_program_id",
        title: "за ID медичної програми",
        validate: uuidValidate
      },
      {
        name: "medical_program_name",
        title: "за назвою медичної програми"
      },
      {
        name: "innm_dosage_id",
        title: "за ID Лікарської форми",
        validate: uuidValidate
      },
      {
        name: "innm_dosage_name",
        title: "за назвою Лікарської форми"
      },
      {
        name: "medication_id",
        title: "за ID Торгової Назви",
        validate: uuidValidate
      },
      { name: "medication_name", title: "за Торговою Назвою" }
    ]
  }
];

const ProgramMedicationsListPage = ({
  program_medications = [],
  paging,
  location
}) => (
  <div id="medication-list-page">
    <Helmet
      title="Учасники медичних программ"
      meta={[{ property: "og:title", content: "Учасники медичних программ" }]}
    />
    <ListHeader
      button={
        <Button
          to="/program-medications/create"
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
        >
          Додати учасника
        </Button>
      }
    >
      <H1>Перелік учасників медичних програм</H1>
    </ListHeader>

    <div>
      <H2>Пошук учасників програм</H2>
      <SearchForm fields={SEARCH_FIELDS} location={location} />
    </div>

    <ListShowBy>
      <ShowBy location={location} />
    </ListShowBy>

    <ListTable id="medication-table">
      <Table
        columns={[
          { key: "medical_program_id", title: "ID\n медичної програми" },
          {
            key: "medical_program_name",
            title: "Назва медичної програми"
          },
          { key: "medication_name", title: "Торгівельне найменування" },
          { key: "medication_form", title: "Форма" },
          { key: "manufacturer", title: "Виробник" },
          { key: "reimbursement_amount", title: "Сума Відшкодування" },
          { key: "status", title: "Активний" },
          { key: "action", title: "Дії", width: 100 }
        ]}
        data={program_medications.map(item => ({
          medical_program_id: <div>{item.medical_program.id}</div>,
          medical_program_name: <div>{item.medical_program.name}</div>,
          medication_name: <div>{item.medication.name}</div>,
          medication_form: (
            <div>
              <DictionaryValue
                dictionary="MEDICATION_FORM"
                value={item.medication.form}
              />
            </div>
          ),
          manufacturer: (
            <div>
              {item.medication.manufacturer.name}{" "}
              {item.medication.manufacturer.country}
            </div>
          ),
          reimbursement_amount: (
            <div>{item.reimbursement.reimbursement_amount}</div>
          ),
          status: (
            <div>
              {item.is_active ? (
                <ColoredText color="green">активна</ColoredText>
              ) : (
                <ColoredText color="red">неактивна</ColoredText>
              )}
            </div>
          ),
          action: (
            <Button
              id={`show-medical-programs-detail-button-${item.id}`}
              theme="link"
              to={`/program-medications/${item.id}`}
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
      dispatch(fetchProgramMedications({ page_size: 5, ...query }))
  }),
  connect(state => ({
    ...state.pages.ProgramMedicationsListPage,
    program_medications: getProgramMedications(
      state,
      state.pages.ProgramMedicationsListPage.program_medications
    )
  }))
)(ProgramMedicationsListPage);
