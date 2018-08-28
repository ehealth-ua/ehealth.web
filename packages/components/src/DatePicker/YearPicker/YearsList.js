import React from "react";
import styled from "react-emotion/macro";
import { List, Item } from "../Body";

const YearsList = ({ selectedYear, choiseYear }) => {
  const startYear = selectedYear - 15;
  const yearsArray = Array.from(
    new Array(16),
    (val, index) => index + startYear
  );
  return (
    <List>
      {yearsArray.map(year => (
        <Item key={year} col={4} onClick={() => choiseYear(year)}>
          {year}
        </Item>
      ))}
    </List>
  );
};

export default YearsList;
