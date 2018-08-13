import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router";
import { provideHooks } from "redial";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import format from "date-fns/format";

import Line from "../../../components/Line";
import {
  DetailMain,
  DetailRow,
  DetailRowRight
} from "../../../components/Detail";
import { H1 } from "../../../components/Title";
import DataList from "../../../components/DataList";

import BackLink from "../../blocks/BackLink";
import DictionaryValue from "../../blocks/DictionaryValue";
import ShowWithScope from "../../blocks/ShowWithScope";
import Container from "../../blocks/Container";

import { getMedicationDispense } from "../../../reducers";

import { fetchMedicationDispense } from "./redux";

const MedicationDispenseDetailPage = ({
  router,
  medication_dispense: {
    id,
    status,
    dispensed_at,
    legal_entity = {},
    division = {},
    party = {},
    medication_request: { person = {}, ...medication_request } = {},
    details = [],
    medical_program = {}
  } = {}
}) => (
  <div id="medication-dispense-detail-page">
    <Helmet
      title={`Відпуск рецептів - Відпуск ${id}`}
      meta={[
        { property: "og:title", content: `Відпуск рецептів - Відпуск ${id}` }
      ]}
    />

    <BackLink onClick={() => router.goBack()}>
      Повернутися до списку рецептів
    </BackLink>

    <Line />

    <DetailMain>
      <H1>I. Загальна інформація</H1>

      <DataList
        list={[
          { name: "ID відпуску рецепту", value: id },
          { name: "Статус", value: status },
          {
            name: "ID рецепту",
            value: (
              <DetailRow>
                <div>{medication_request.id}</div>

                <ShowWithScope scope="medication_request:read">
                  <DetailRowRight>
                    <BackLink
                      iconPosition="right"
                      to={`/medication-requests/${medication_request.id}`}
                    >
                      Перейти до рецепту
                    </BackLink>
                  </DetailRowRight>
                </ShowWithScope>
              </DetailRow>
            )
          },
          { name: "Номер рецепту", value: medication_request.request_number },
          { name: "Дата відпуску", value: format(dispensed_at, "DD/MM/YYYY") }
        ]}
      />

      <Line />

      <H1>II. Аптека</H1>

      <DataList
        list={[
          { name: "ID аптеки", value: legal_entity.id },
          { name: "Назва", value: legal_entity.name },
          { name: "ЄДРПОУ", value: legal_entity.edrpou },
          { name: "ID підрозділу", value: division.id },
          { name: "Назва підрозділу", value: division.name }
        ]}
      />

      <Line />

      <H1>III. Інформація про працівника</H1>

      <DataList
        list={[
          { name: "ID особи", value: party.id },
          { name: "Прізвище", value: party.last_name },
          { name: "Ім'я", value: party.first_name },
          party.second_name && { name: "По батькові", value: party.second_name }
        ]}
      />

      <Line />

      <H1>IV. Інформація про пацієнта</H1>

      <DataList
        list={[
          { name: "ID особи", value: person.id },
          { name: "Прізвище", value: person.last_name },
          { name: "Ім'я", value: person.first_name },
          person.second_name && {
            name: "По батькові",
            value: person.second_name
          },
          { name: "ІНН", value: person.tax_id },
          {
            name: "Вік (роки)",
            value: person.age
          }
        ]}
      />

      <Line />

      <H1>V. Лікарський засіб</H1>

      {details.map(
        (
          {
            medication: { name, manufacturer, form, container },
            medication_qty,
            sell_price,
            sell_amount,
            discount_amount,
            reimbursement_amount
          },
          index
        ) => (
          <DataList
            key={index}
            list={[
              { name: "Назва", value: name },
              { name: "Виробник", value: manufacturer.name },
              {
                name: "Форма",
                value: (
                  <DictionaryValue dictionary="MEDICATION_FORM" value={form} />
                )
              },
              { name: "Упаковка", value: <Container container={container} /> },
              { name: "Вартість одиниці", value: sell_price },
              { name: "Вартість продажу", value: sell_amount },
              { name: "Продано", value: medication_qty },
              { name: "Знижка", value: discount_amount },
              { name: "Відшкодування", value: reimbursement_amount }
            ]}
          />
        )
      )}

      <Line />

      <H1>VI. Медична програма</H1>

      <DataList
        list={[
          { name: "ID програми", value: medical_program.id },
          { name: "Назва програми", value: medical_program.name }
        ]}
      />
    </DetailMain>
  </div>
);

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, params: { id } }) =>
      dispatch(fetchMedicationDispense(id))
  }),
  connect((state, { params: { id } }) => ({
    medication_dispense: getMedicationDispense(state, id)
  }))
)(MedicationDispenseDetailPage);
