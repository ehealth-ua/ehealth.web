import React from "react";
import { Link } from "@ehealth/components";

import OrderedList from "../components/OrderedList";
import Line from "../components/Line";
import { ArrowRightIcon } from "@ehealth/icons";

const NoDeclarationList = () => (
  <>
    <p>
      Декларація відсутня. Для підписання декларації, виконайте наступні кроки
    </p>
    <OrderedList>
      {[
        "Оберіть лікаря",
        "Створіть запит на декларацію",
        "Очікуйте на підтвердження"
      ]}
    </OrderedList>
    <Line />

    <Link
      to="/search"
      size="small"
      upperCase
      spaced
      bold
      icon={<ArrowRightIcon height="15px" fill="#2292f2" />}
      dataTest="searchLink"
    >
      крок 1. оберіть лікаря
    </Link>
  </>
);

export default NoDeclarationList;
