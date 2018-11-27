import React from "react";

import { List, Item } from "../Body";

const DayList = ({ calendar, getDateProps }) => (
  <List data-test="calendarDates">
    {calendar.weeks.map((week, windex) =>
      week.map((dateObj, index) => {
        let key = `${calendar.month}-${calendar.year}-${windex}-${index}`;
        if (!dateObj) {
          return <Item key={key} col={7} />;
        }
        const {
          date,
          selected,
          selectable,
          today,
          prevMonth,
          nextMonth
        } = dateObj;
        return (
          <Item
            key={key}
            col={7}
            {...getDateProps({
              dateObj
            })}
            selected={selected}
            unavailable={!selectable}
            currentMonth={!(!prevMonth && !nextMonth)}
            today={today}
            onMouseDown={e => e.preventDefault()}
          >
            {date.getDate()}
          </Item>
        );
      })
    )}
  </List>
);

export default DayList;
