import React from "react";
import styled from "react-emotion/macro";
import Dayzed from "dayzed";
import { css } from "react-emotion";

const monthNamesFull = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень"
];

const weekdayNamesShort = ["ПН", "ВТ", "СР", "ЧТ", "ПН", "СБ", "НД"];

const MonthPanel = ({ calendar, getDateProps }) => {
  return (
    <>
      <DaysOfMonth>
        {weekdayNamesShort.map((weekday, idx) => (
          <DayOfMonthEmpty
            key={`${calendar.month}-${calendar.year}-${weekday}-${idx}`}
            {...(idx === 0 ? { "data-test": "firstDayOfWeek" } : {})}
          >
            {weekday}
          </DayOfMonthEmpty>
        ))}
      </DaysOfMonth>
      <CalendarDates data-test="calendarDates">
        {calendar.weeks.map((week, windex) =>
          week.map((dateObj, index) => {
            let key = `${calendar.month}-${calendar.year}-${windex}-${index}`;
            if (!dateObj) {
              return <DayOfMonthEmpty key={key} />;
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
              <DayOfMonth
                key={key}
                {...getDateProps({
                  dateObj
                })}
                selected={selected}
                unavailable={!selectable}
                currentMonth={!prevMonth && !nextMonth}
                today={today}
              >
                {selectable ? date.getDate() : "X"}
              </DayOfMonth>
            );
          })
        )}
      </CalendarDates>
    </>
  );
};

class Datepicker extends React.Component {
  render() {
    return (
      <Dayzed {...this.props}>
        {({ calendars, getDateProps, getBackProps, getForwardProps }) => {
          if (calendars.length) {
            console.log(calendars);
            return (
              <Calendar>
                {calendars.map(calendar => (
                  <Month key={`${calendar.month}-${calendar.year}`}>
                    <MounthYear data-test="monthYear">
                      <PrevButton
                        {...getBackProps({
                          calendars,
                          "data-test": "backMonth"
                        })}
                      />
                      {monthNamesFull[calendar.month]} {calendar.year}
                      <NextButton
                        {...getForwardProps({
                          calendars,
                          "data-test": "forwardMonth"
                        })}
                      />
                    </MounthYear>
                    <MonthPanel
                      calendar={calendar}
                      getDateProps={getDateProps}
                    />
                  </Month>
                ))}
              </Calendar>
            );
          }
          return null;
        }}
      </Dayzed>
    );
  }
}

export default Datepicker;

const Calendar = styled.div`
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  color: #354052;
  background: #fff;
  box-shadow: 0 2px 4px rgba(72, 60, 60, 0.2);
`;

const Month = styled.div`
  box-sizing: border-box;
`;

const CalendarDates = styled.div`
  padding: 10px 30px 25px;
`;

const dayOfMonthStyle = css`
  display: inline-block;
  width: calc((100% / 7) - 4px);
  border: none;
  margin: 2px;
  border-radius: 50%;
`;

const DayOfMonth = styled.button`
  ${dayOfMonthStyle};
  height: 31px;
  color: ${props => !props.currentMonth && "#9aa0a9"};
  color: ${props => props.selected && "#fff"};
  background: ${props => props.selected && "#1A91EB"};
  cursor: pointer;
  &:focus {
    outline: 0;
  }
`;
const DayOfMonthEmpty = styled.div`
  ${dayOfMonthStyle};
`;

const DaysOfMonth = styled.div`
  padding: 20px 30px 0;
  font-size: 10px;
  color: #9aa0a9;
  text-transform: uppercase;
`;

const MounthYear = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #dfe3e9;
`;

const NextButton = styled.button`
  background: none;
  border: 0 none;
  &:after {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 0 6px 10.4px;
    border-color: transparent transparent transparent #ced0da;
    content: "";
  }
`;

const PrevButton = styled.button`
  background: none;
  border: 0 none;
  &:after {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 10.4px 6px 0;
    border-color: transparent #ced0da transparent transparent;
    content: "";
  }
`;
