import React from "react";
import styled from "react-emotion/macro";
import { monthNamesFull } from "../contants";
import { List, Item } from "../Body";

const MonthsList = ({ choiseMonth }) => {
  return (
    <List>
      {monthNamesFull.map((month, index) => (
        <Item key={index} col={3} onClick={() => choiseMonth(index)}>
          {month}
        </Item>
      ))}
    </List>
  );
};

export default MonthsList;
