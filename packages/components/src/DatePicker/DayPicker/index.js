import React from "react";
import Dayzed from "dayzed";

import DayPanel from "./DayPanel";
import { Button, Title, Header } from "../Header";
import { MONTH_NAMES } from "../constants";

const DayPicker = ({
  offset,
  increase,
  decrease,
  switchMode,
  getCurrentMonth,
  ...props
}) => (
  <Dayzed {...props} offset={offset} firstDayOfWeek={1} showOutsideDays>
    {({ calendars, getDateProps, getBackProps, getForwardProps }) =>
      calendars.map(calendar => (
        <React.Fragment key={`${calendar.month}-${calendar.year}`}>
          <Header data-test="monthYear">
            <Button
              {...getBackProps({
                calendars,
                "data-test": "backMonth"
              })}
              onClick={decrease}
              direction="backward"
            />
            <div>
              <Title
                onClick={() => {
                  switchMode("month");
                  getCurrentMonth(calendar.month);
                }}
              >
                {MONTH_NAMES[calendar.month]}{" "}
              </Title>
              <Title onClick={() => switchMode("year")}>{calendar.year}</Title>
            </div>
            <Button
              {...getForwardProps({
                calendars,
                "data-test": "forwardMonth"
              })}
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
