import React from "react";
import format from "date-fns/format";

import { ListTable, ListStatus } from "../../../components/List";
import Button from "../../../components/Button";
import Table from "../../../components/Table";

export default class ClinicsList extends React.Component {
  render() {
    const { clinics = [] } = this.props;

    return (
      <ListTable id="clinics-table">
        <Table
          columns={[
            { key: "date", title: "Дата створення" },
            { key: "name", title: "Назва" },
            { key: "edrpou", title: "ЕДРПОУ" },
            { key: "address", title: "Адреса" },
            { key: "status", title: "Статус" },
            { key: "verification", title: "Перевірка медичних закладiв" },
            { key: "action", title: "Дії", width: 100 }
          ]}
          data={clinics.map(i => ({
            date: format(i.inserted_at, "DD/MM/YYYY"),
            name: (
              <div>
                {i.name}
                <p>ЕДРПОУ {i.edrpou}</p>
              </div>
            ),
            address: (
              <div>
                <div>{i.addresses[0].settlement}</div>
                {i.addresses[0].area}
              </div>
            ),
            status: (
              <ListStatus verified={i.nhs_verified}>
                {i.status === "ACTIVE" && "Діюча"}
                {i.status === "CLOSED" && "Закрита"}
              </ListStatus>
            ),
            verification: (
              <ListStatus verified={i.nhs_verified}>
                {i.nhs_verified ? "Підтверджено" : "Не підтверджено"}
              </ListStatus>
            ),
            edrpou: i.edrpou,
            action: (
              <Button
                id={`show-clinic-detail-button-${i.name}`}
                theme="link"
                to={`/clinics/${i.id}`}
              >
                Детально
              </Button>
            )
          }))}
        />
      </ListTable>
    );
  }
}
