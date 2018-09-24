import React from "react";

import { List, Item } from "../Body";

const YearsList = ({ selectedYear, chooseYear }) => {
  const startYear = selectedYear - 15;
  const yearsArray = Array.from(
    new Array(16),
    (val, index) => index + startYear
  );
  return (
    <List>
      {yearsArray.map(year => (
        <Item key={year} col={4} onClick={() => chooseYear(year)}>
          {year}
        </Item>
      ))}
    </List>
  );
};

export default YearsList;
