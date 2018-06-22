import React from "react";
import { CabinetTable, Link } from "@ehealth/components";
import format from "date-fns/format";

import DECLARATION_STATUSES from "../helpers/statuses";

const DeclarationHistory = ({ data }) => (
  <CabinetTable
    data={data}
    header={{
      startDate: "Дата ухвалення декларації",
      status: "Статус",
      divisionName: "Назва відділення",
      employee: (
        <>
          ПІБ<br /> лікаря
        </>
      ),
      legalEntityName: "Медзаклад",
      action: "Дія"
    }}
    renderRow={({
      id,
      startDate,
      status,
      employee: { party: { lastName, firstName, secondName } },
      division: { name: divisionName },
      legalEntity: { name: legalEntityName }
    }) => ({
      startDate: format(startDate, "DD.MM.YYYY"),
      status: DECLARATION_STATUSES[status],
      divisionName,
      employee: (
        <>
          {lastName} {firstName} {secondName}
        </>
      ),
      legalEntityName,
      action: (
        <Link bold to={`/declarations/${id}`}>
          Показати деталі
        </Link>
      )
    })}
  />
);

export default DeclarationHistory;
