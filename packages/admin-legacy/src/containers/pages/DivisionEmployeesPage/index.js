import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Helmet from "react-helmet";

import Line from "../../../components/Line";
import DataList from "../../../components/DataList";

import BackLink from "../../blocks/BackLink";
import DictionaryValue from "../../blocks/DictionaryValue";
import ShowWithScope from "../../blocks/ShowWithScope";

import styles from "./styles.module.css";

const DivisionEmployeesPage = ({ contract, router, divisionId }) => {
  if (!contract) return null;
  const fullName = obj =>
    [obj.last_name, obj.first_name, obj.second_name].join(" ");
  const divisionEmployees = id =>
    contract.contractor_employee_divisions.filter(o => o.division_id === id);
  let employees = [];
  if (contract.contractor_divisions && contract.contractor_divisions.length) {
    employees = divisionEmployees(divisionId);
  }
  return (
    <div id="division-employees-page">
      <Helmet
        title={"Співробітники відділення"}
        meta={[{ property: "og:title", content: "Співробітники відділення" }]}
      />

      <BackLink onClick={() => router.goBack()}>
        Назад до деталів контракту
      </BackLink>

      <Line />

      {employees.map((i, key) => (
        <div key={key}>
          {key !== 0 && <Line />}
          <DataList
            list={[
              {
                name: "Повне і'мя",
                value: fullName(i.employee.party)
              },
              {
                name: "ID",
                value: (
                  <div className={styles.row}>
                    <div>{i.employee.id}</div>
                    <ShowWithScope scope="employee:read">
                      <div className={styles.right}>
                        <BackLink
                          iconPosition="right"
                          to={`/employees/${i.employee.id}`}
                        >
                          Перейти до працівника
                        </BackLink>
                      </div>
                    </ShowWithScope>
                  </div>
                )
              },
              {
                name: "Спеціальність",
                value: (
                  <DictionaryValue
                    dictionary="SPECIALITY_TYPE"
                    value={i.employee.speciality.speciality}
                  />
                )
              },
              {
                name: "Штатна одиниця",
                value: i.staff_units
              },
              {
                name: "Кількість паціентів для підписання декларацій",
                value: i.declaration_limit
              }
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default compose(
  withRouter,
  connect((state, { params: { id, divisionId } }) => ({
    id,
    divisionId,
    contract: state.data.contracts[id]
  }))
)(DivisionEmployeesPage);
