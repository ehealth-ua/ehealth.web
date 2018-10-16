import React from "react";
import { compose } from "redux";
import format from "date-fns/format";
import { connect } from "react-redux";
import { provideHooks } from "redial";

import Helmet from "react-helmet";

import Line from "../../../components/Line";
import DataList from "../../../components/DataList";
import InlineList from "../../../components/InlineList";
import Button from "../../../components/Button";
import YesNo from "../../../components/YesNo";

import BackLink from "../../blocks/BackLink";
import DictionaryValue from "../../blocks/DictionaryValue";
import DoctorDetails from "../../blocks/DoctorDetails";

import { fetchEmployee } from "./redux";

import styles from "./styles.module.css";

import { BackIcon } from "@ehealth/icons";

import { backUrl } from "../../../helpers/url";

class EmployeeDetailPage extends React.Component {
  render() {
    const {
      router,
      employee: {
        id,
        status,
        start_date,
        end_date,
        position,
        doctor = "",
        party: {
          id: partyId,
          last_name,
          first_name,
          second_name,
          no_tax_id,
          tax_id,
          birth_date,
          gender,
          phones,
          documents = []
        } = {}
      } = {}
    } = this.props;

    const fullName = `${last_name} ${first_name} ${second_name}`;

    const backLocationPath = backUrl(router);

    return (
      <div id="employee-detail-page">
        <Helmet
          title={`Співробітник - ${fullName}`}
          meta={[
            { property: "og:title", content: `Співробітник - ${fullName}` }
          ]}
        />

        <BackLink onClick={() => router.push(backLocationPath)}>
          Повернутися до списку співробітників
        </BackLink>

        <Line />

        <div className={styles.main}>
          <DataList
            list={[{ name: "Ідентифікатор співробітника", value: id }]}
          />

          <Line />

          <div className={styles.strong}>
            <DataList
              theme="small"
              list={[
                { name: "Повне Ім’я", value: fullName },
                { name: "Без ІПН", value: <YesNo bool={no_tax_id} /> },
                { name: "ІПН / Паспорт", value: tax_id }
              ]}
            />
          </div>

          <Line />

          <DataList
            theme="min"
            list={[
              {
                name: "Дата народження",
                value: format(birth_date, "DD/MM/YYYY")
              },
              {
                name: "Стать",
                value: <DictionaryValue dictionary="GENDER" value={gender} />
              }
            ]}
          />

          <Line />

          <DataList
            theme="min"
            list={[
              {
                name: "Телефони",
                value: <InlineList list={phones.map(item => item.number)} />
              },
              {
                name: "Документи",
                value: (
                  <ul className={styles.docs}>
                    {documents.map(({ number, type }) => (
                      <li key={number}>
                        <DictionaryValue
                          dictionary="DOCUMENT_TYPE"
                          value={type}
                        />
                        &nbsp; № {number}
                      </li>
                    ))}
                  </ul>
                )
              }
            ]}
          />

          <Line />

          <DataList
            theme="min"
            list={[
              { name: "Ідентифікатор особи", value: partyId },
              {
                name: "Статус",
                value: (
                  <DictionaryValue
                    dictionary="EMPLOYEE_STATUS"
                    value={status}
                  />
                )
              },
              {
                name: "Дата початку роботи",
                value: format(start_date, "DD/MM/YYYY")
              },
              {
                name: "Дата завершення роботи",
                value: end_date ? format(end_date, "DD/MM/YYYY") : "-"
              },
              {
                name: "Позиція",
                value: (
                  <DictionaryValue dictionary="POSITION" value={position} />
                )
              },
              doctor && {
                name: "Навчання та кваліфікація",
                value: <DoctorDetails doctor={doctor} />
              }
            ]}
          />

          <div className={styles.buttons}>
            <Button
              onClick={() => router.push(backLocationPath)}
              theme="border"
              color="blue"
              icon={<BackIcon width="20" height="12" />}
              block
            >
              Повернутися
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  provideHooks({
    fetch: ({ dispatch, params: { id } }) => dispatch(fetchEmployee(id))
  }),
  connect(state => state.pages.EmployeeDetailPage)
)(EmployeeDetailPage);
