import React from "react";
import MonthsList from "./MonthsList";
import { Title, Header } from "../Header";
import { MONTH_NAMES } from "../constants";

const MonthPicker = ({ chooseMonth, currentMonth }) => (
  <>
    <Header data-test="monthHeader" center>
      <Title onClick={() => chooseMonth(currentMonth)}>
        {MONTH_NAMES[currentMonth]}
      </Title>
    </Header>
    <MonthsList chooseMonth={chooseMonth} />
  </>
);

export default MonthPicker;
