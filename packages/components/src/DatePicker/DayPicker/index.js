import React from "react";
import Dayzed from "dayzed";

import DayPanel from "./DayPanel";
import { Button, Title, Header } from "../Header";
import { MONTH_NAMES } from "../constants";

const DayPicker = ({
  offset,
  increase,
  decrease,
  selected,
  switchMode,
  getCurrentMonth,
  ...props
}) => (
  <Dayzed
    {...props}
    offset={offset}
    selected={selected}
    date={selected ? selected : undefined}
    firstDayOfWeek={1}
    showOutsideDays
  >
    {({ calendars, getDateProps }) =>
      calendars.map(calendar => (
        <React.Fragment key={`${calendar.month}-${calendar.year}`}>
          <Header data-test="monthYear">
            <Button
              data-test="backMonth"
              onMouseDown={e => e.preventDefault()}
              onClick={decrease}
              direction="backward"
            />
            <div>
              <Title
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  switchMode("month");
                  getCurrentMonth(calendar.month);
                }}
              >
                {MONTH_NAMES[calendar.month]}{" "}
              </Title>
              <Title
                onMouseDown={e => e.preventDefault()}
                onClick={() => switchMode("year")}
              >
                {calendar.year}
              </Title>
            </div>
            <Button
              data-test="forwardMonth"
              onMouseDown={e => e.preventDefault()}
              onClick={increase}
              direction="forward"
            />
          </Header>
          <DayPanel calendar={calendar} getDateProps={getDateProps} />
        </React.Fragment>
      ))
    }
  </Dayzed>
);

export default DayPicker;
