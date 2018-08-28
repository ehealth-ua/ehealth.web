import React, { Component } from "react";

import YearPicker from "./YearPicker";
import DayPicker from "./DayPicker";
import MonthPicker from "./MonthPicker";
import { Container } from "./Body";

import { Switch } from "@ehealth/components";

type Props = {|
  date?: Date,
  selected?: Date | Date[],
  monthsToDisplay?: number,
  firstDayOfWeek?: number,
  offset?: number,
  minDate?: Date,
  maxDate?: Date,
  fillAdjacentMonths?: boolean,
  showOutsideDays?: boolean,
  onDateSelected: () => mixed,
  onOffsetChanged: () => mixed
|};

type State = {|
  mode: string,
  offset: number,
  selectedYear: number,
  currentYear: string,
  currentMonth: number
|};

class Datepicker extends Component<Props, State> {
  state = {
    mode: "day",
    offset: 0,
    selectedYear: null,
    currentYear: new Date().getFullYear(),
    currentMonth: 0
  };

  render() {
    return (
      <Container>
        <Switch
          value={this.state.mode}
          year={
            <YearPicker
              selectedYear={this.state.selectedYear}
              choiseYear={this.choiseYear}
              switchMode={this.switchMode}
            />
          }
          month={
            <MonthPicker
              currentMonth={this.state.currentMonth}
              choiseMonth={this.choiseMonth}
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

  choiseYear = (year: number): void => {
    this.setState(({ currentYear }) => ({
      selectedYear: year,
      mode: "day",
      offset: -(currentYear - year) * 12
    }));
  };

  choiseMonth = (month: number): void => {
    this.setState(({ offset }) => ({
      currentMonth: month,
      mode: "day",
      offset: offset + month - this.state.currentMonth
    }));
  };

  getCurrentMonth = (month: number): void => {
    this.setState({ currentMonth: month });
  };

  increase = (): void => {
    this.setState({ offset: this.state.offset + 1 });
  };

  decrease = (): void => {
    this.setState({ offset: this.state.offset - 1 });
  };

  switchMode = (mode: string): void => {
    this.setState({ mode });
  };
}

export default Datepicker;
