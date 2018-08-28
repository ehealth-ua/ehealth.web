import React from "react";
import MonthsList from "./MonthsList";
import { Title, Header } from "../Header";
import { MONTH_NAMES } from "../constants";

const MonthPicker = ({ choiseMonth, currentMonth }) => {
  return (
    <>
      <Header data-test="monthHeader" center>
        <Title onClick={() => choiseMonth(currentMonth)}>
          {MONTH_NAMES[currentMonth]}
        </Title>
      </Header>
      <MonthsList choiseMonth={choiseMonth} />
    </>
  );
};

export default MonthPicker;
