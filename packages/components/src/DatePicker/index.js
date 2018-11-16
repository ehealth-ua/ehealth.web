// @flow
import * as React from "react";
import Switch from "../Switch";

import YearPicker from "./YearPicker";
import DayPicker from "./DayPicker";
import MonthPicker from "./MonthPicker";
import { Container } from "./Body";

type DatepickerProps = {|
  date?: Date,
  selected?: Date | Date[],
  monthsToDisplay?: number,
  firstDayOfWeek?: number,
  offset?: number,
  minDate?: Date,
  maxDate?: Date,
  fillAdjacentMonths?: boolean,
  showOutsideDays?: boolean,
  placement?: string,
  onDateSelected: () => mixed,
  onOffsetChanged: () => mixed
|};

type DatepickerMode = "day" | "month" | "year";

type DatepickerState = {|
  mode: DatepickerMode,
  offset: number,
  selectedYear: ?number,
  currentYear: number,
  currentMonth: number
|};

class Datepicker extends React.Component<DatepickerProps, DatepickerState> {
  state = {
    mode: "day",
    offset: 0,
    selectedYear: null,
    currentYear: parseInt(new Date().getFullYear(), 10),
    currentMonth: parseInt(new Date().getMonth(), 10)
  };

  componentWillUpdate(nextProps: DatepickerProps, nextState: DatepickerState) {
    if (
      nextProps.selected.getFullYear() !== this.props.selected.getFullYear()
    ) {
      this.chooseYear(nextProps.selected.getFullYear());
    }

    if (nextProps.selected.getMonth() !== this.props.selected.getMonth()) {
      this.chooseMonth(nextProps.selected.getMonth());
    }
  }

  componentWillMount() {
    this.chooseYear(this.props.selected.getFullYear());
    this.chooseMonth(this.props.selected.getMonth());
  }

  render() {
    const { placement } = this.props;
    return (
      <Container placement={placement}>
        <Switch
          value={this.state.mode}
          year={
            <YearPicker
              selectedYear={this.state.selectedYear}
              chooseYear={this.chooseYear}
              switchMode={this.switchMode}
            />
          }
          month={
            <MonthPicker
              currentMonth={this.state.currentMonth}
              chooseMonth={this.chooseMonth}
              switchMode={this.switchMode}
            />
          }
          day={
            <DayPicker
              offset={this.state.offset}
              increase={this.increase}
              decrease={this.decrease}
              switchMode={this.switchMode}
              getCurrentMonth={this.getCurrentMonth}
              {...this.props}
            />
          }
        />
      </Container>
    );
  }

  chooseYear = (year: number): void => {
    this.setState(({ currentYear }) => ({
      selectedYear: year,
      mode: "day",
      offset: -(currentYear - year) * 12
    }));
  };

  chooseMonth = (month: number): void => {
    this.setState(({ offset, currentMonth }) => ({
      currentMonth: month,
      mode: "day",
      offset: offset + (month - currentMonth)
    }));
  };

  getCurrentMonth = (month: number): void => {
    this.setState({ currentMonth: month });
  };

  increase = (): void => {
    this.setState(({ offset }) => ({
      offset: offset + 1
    }));
  };

  decrease = (): void => {
    this.setState(({ offset }) => ({
      offset: offset - 1
    }));
  };

  switchMode = (mode: DatepickerMode): void => {
    this.setState({ mode });
  };
}

export default Datepicker;
