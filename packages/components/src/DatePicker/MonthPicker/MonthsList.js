import React from "react";

import { MONTH_NAMES } from "../constants";
import { List, Item } from "../Body";

const MonthsList = ({ chooseMonth }) => {
  return (
    <List>
      {MONTH_NAMES.map((month, index) => (
        <Item key={index} col={3} onClick={() => chooseMonth(index)}>
          {month}
        </Item>
      ))}
    </List>
  );
};

export default MonthsList;
