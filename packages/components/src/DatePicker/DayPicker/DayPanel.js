import React from "react";

import DayList from "./DayList";
import { List, Item } from "../Body";
import { WEEKDAY_NAMES } from "../constants";

const DayPanel = ({ calendar, getDateProps }) => {
  return (
    <>
      <List week>
        {WEEKDAY_NAMES.map((weekday, idx) => (
          <Item
            key={`${calendar.month}-${calendar.year}-${weekday}-${idx}`}
            {...(idx === 0 ? { "data-test": "firstDayOfWeek" } : {})}
            col={7}
            weekday
            onMouseDown={e => e.preventDefault()}
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
