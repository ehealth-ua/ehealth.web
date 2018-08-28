import React from "react";
import MonthsList from "./MonthsList";
import { Title, Header } from "../Header";
import { monthNamesFull } from "../contants";

const MonthPicker = ({ choiseMonth, currentMonth }) => {
  return (
    <>
      <Header data-test="monthHeader" center>
        <Title onClick={() => choiseMonth(currentMonth)}>
          {monthNamesFull[currentMonth]}
        </Title>
      </Header>
      <MonthsList choiseMonth={choiseMonth} />
    </>
  );
};

export default MonthPicker;
