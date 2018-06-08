import React from "react";
import { CabinetTable, Link } from "@ehealth/components";
import format from "date-fns/format";

import DECLARATION_STATUSES from "../helpers/statuses";

const DeclarationHistory = ({ data }) => (
  <CabinetTable
    data={data}
    header={{
      start_date: "Дата ухвалення декларації",
      status: "Статус",
      division_name: "Назва відділення",
      employee: (
        <>
          ПІБ<br /> лікаря
        </>
      ),
      // doctor_contact: "Контакті дані лікаря",
      legal_entity_name: "Медзаклад",
      action: "Дія"
    }}
    renderRow={({
      id: declaration_id,
      start_date,
      status,
      employee: { party: { last_name, first_name, second_name } },
      division: { name: division_name },
      legal_entity: { name: legal_entity_name },
      details
    }) => ({
      start_date: format(start_date, "DD.MM.YYYY"),
      status: DECLARATION_STATUSES[status],
      division_name,
      employee: (
        <>
          {last_name} {first_name} {second_name}
        </>
      ),
      legal_entity_name,
      action: (
        <Link bold to={`/declarations/${declaration_id}`}>
          Показати деталі
        </Link>
      )
    })}
  />
);

export default DeclarationHistory;
