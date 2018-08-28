import React from "react";
import styled from "react-emotion/macro";
import DayList from "./DayList";
import { List, Item } from "../Body";

import { weekdayNamesShort } from "../contants";

const DayPanel = ({ calendar, getDateProps }) => {
  return (
    <>
      <List week>
        {weekdayNamesShort.map((weekday, idx) => (
          <Item
            key={`${calendar.month}-${calendar.year}-${weekday}-${idx}`}
            {...(idx === 0 ? { "data-test": "firstDayOfWeek" } : {})}
            col={7}
            weekday
          >
            {weekday}
          </Item>
        ))}
      </List>
      <DayList calendar={calendar} getDateProps={getDateProps} />
    </>
  );
};

export default DayPanel;
